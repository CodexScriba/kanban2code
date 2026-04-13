#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import queue
import re
import shutil
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple


VALID_STAGES = {"plan", "code", "audit", "completed"}


class OrchestratorError(RuntimeError):
    pass


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def local_timestamp() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def stringify_path(path: Path, repo_root: Path) -> str:
    try:
        return path.resolve().relative_to(repo_root.resolve()).as_posix()
    except ValueError:
        return str(path.resolve())


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def read_json(path: Path) -> Dict[str, Any]:
    return json.loads(read_text(path))


def write_json(path: Path, payload: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def strip_quotes(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def parse_scalar(value: str) -> Any:
    value = value.strip()
    if value == "":
        return ""
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [strip_quotes(part.strip()) for part in inner.split(",") if part.strip()]
    lowered = value.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if re.fullmatch(r"-?\d+\.\d+", value):
        return float(value)
    return strip_quotes(value)


def parse_block(block_lines: List[str]) -> Any:
    stripped = [line for line in block_lines if line.strip()]
    if not stripped:
        return []
    if stripped[0].lstrip().startswith("- "):
        items: List[Any] = []
        for line in stripped:
            items.append(parse_scalar(line.lstrip()[2:]))
        return items
    payload: Dict[str, Any] = {}
    for line in stripped:
        if ":" not in line:
            continue
        key, raw_value = line.lstrip().split(":", 1)
        payload[key.strip()] = parse_scalar(raw_value.strip())
    return payload


def parse_simple_yaml(lines: List[str]) -> Dict[str, Any]:
    payload: Dict[str, Any] = {}
    index = 0
    while index < len(lines):
        line = lines[index].rstrip("\n")
        if not line.strip():
            index += 1
            continue
        if line.startswith(" ") or ":" not in line:
            index += 1
            continue
        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()
        if raw_value:
            payload[key] = parse_scalar(raw_value)
            index += 1
            continue
        index += 1
        block: List[str] = []
        while index < len(lines):
            next_line = lines[index].rstrip("\n")
            if next_line and not next_line.startswith(" "):
                break
            block.append(next_line)
            index += 1
        payload[key] = parse_block(block)
    return payload


def split_frontmatter(markdown: str) -> Tuple[Dict[str, Any], str]:
    lines = markdown.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, markdown
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            metadata = parse_simple_yaml(lines[1:index])
            body = "\n".join(lines[index + 1 :])
            if markdown.endswith("\n"):
                body += "\n"
            return metadata, body
    return {}, markdown


def has_section(body: str, heading: str) -> bool:
    pattern = r"(?m)^" + re.escape(heading) + r"\s*$"
    return re.search(pattern, body) is not None


def has_blocking_questions(body: str) -> bool:
    return bool(re.search(r"(?mi)^(Questions:|### Questions)\s*$", body))


def extract_review_section(body: str) -> str:
    matches = list(re.finditer(r"(?m)^## Review\s*$", body))
    if not matches:
        return ""
    return body[matches[-1].start() :]


def extract_review_data(body: str) -> Dict[str, Any]:
    section = extract_review_section(body)
    if not section:
        return {}
    rating_match = re.search(r"(?im)Rating:\s*(\d+)\s*/\s*10", section)
    verdict_match = re.search(r"(?im)Verdict:\s*(ACCEPTED|NEEDS WORK)", section)
    summary_match = re.search(r"(?ims)^### Summary\s*(.+?)(?=^### |\Z)", section)
    return {
        "section": section,
        "rating": int(rating_match.group(1)) if rating_match else None,
        "verdict": verdict_match.group(1).upper() if verdict_match else None,
        "summary": summary_match.group(1).strip() if summary_match else "",
    }


def remove_section(markdown: str, heading: str) -> str:
    pattern = re.compile(
        r"(?ms)^##\s+"
        + re.escape(heading)
        + r"\s*$.*?(?=^##\s+|\Z)"
    )
    return re.sub(pattern, "", markdown).strip() + "\n"


def detect_unattended_flag(help_text: str, preferences: Sequence[str]) -> Optional[str]:
    for flag in preferences:
        if flag in help_text:
            return flag
    return None


def task_sort_key(path: Path, repo_root: Path) -> Tuple[str, int, int, str]:
    relative = stringify_path(path, repo_root)
    phase_match = re.search(r"/phase(\d+)[^/]*/", f"/{relative}")
    task_match = re.search(r"/task(\d+)\.(\d+)", f"/{relative}")
    project_prefix = relative.split("/phase", 1)[0]
    phase_number = int(phase_match.group(1)) if phase_match else 9999
    task_number = int(task_match.group(2)) if task_match else 9999
    return (project_prefix.lower(), phase_number, task_number, relative.lower())


@dataclass
class TaskSnapshot:
    path: Path
    metadata: Dict[str, Any]
    body: str
    text: str

    @property
    def stage(self) -> str:
        return str(self.metadata.get("stage", "")).strip().lower()

    @property
    def agent(self) -> str:
        return str(self.metadata.get("agent", "")).strip().lower()


@dataclass
class ProviderSpec:
    provider_key: str
    alias: str
    cli: str
    subcommand: str
    model: str
    prompt_style: str
    output_flags: List[str]
    unattended_flags: List[str]
    config_overrides: Dict[str, Any]
    directory_flag: Optional[str]
    last_message_flag: Optional[str]
    variant: Optional[str]


@dataclass
class CodexInvocationResult:
    ok: bool
    exit_code: Optional[int]
    timeout_type: Optional[str]
    final_message: str
    raw_output_path: Path
    last_message_path: Path
    error_message: str
    command: List[str]


@dataclass
class StageResult:
    kind: str
    message: str
    stage_after: Optional[str] = None
    agent_after: Optional[str] = None
    rating: Optional[int] = None
    verdict: Optional[str] = None
    provider_key: Optional[str] = None
    provider_alias: Optional[str] = None
    model: Optional[str] = None
    exit_code: Optional[int] = None
    timeout_type: Optional[str] = None
    final_message: str = ""
    raw_output_path: Optional[str] = None
    last_message_path: Optional[str] = None
    review_excerpt: str = ""
    command: Optional[List[str]] = None


class CodexCLI:
    def __init__(self, repo_root: Path, cli_config: Dict[str, Any]):
        self.repo_root = repo_root
        self.cli_config = cli_config
        self._cached_help_text: Optional[str] = None
        self._cached_flag: Optional[str] = None

    def command_prefix(self) -> List[str]:
        return list(self.cli_config.get("command", ["codex"]))

    def ensure_binary(self) -> str:
        binary = self.command_prefix()[0]
        resolved = self.resolve_binary(binary)
        if not resolved:
            raise OrchestratorError(f"Could not find '{binary}' on PATH.")
        return resolved

    def resolve_binary(self, binary: str) -> Optional[str]:
        resolved = shutil.which(binary)
        if not resolved:
            return None
        binary_path = Path(resolved)
        if sys.platform.startswith("win") and binary_path.suffix.lower() == ".ps1":
            cmd_candidate = binary_path.with_suffix(".cmd")
            if cmd_candidate.exists():
                return str(cmd_candidate)
            exe_candidate = binary_path.with_suffix(".exe")
            if exe_candidate.exists():
                return str(exe_candidate)
        return str(binary_path)

    def executable_command_prefix(self) -> List[str]:
        prefix = self.command_prefix()
        resolved_binary = self.ensure_binary()
        return [resolved_binary, *prefix[1:]]

    def help_text(self) -> str:
        if self._cached_help_text is not None:
            return self._cached_help_text
        help_subcommand = str(self.cli_config.get("subcommand", "exec"))
        command = self.executable_command_prefix() + [help_subcommand, "--help"]
        completed = subprocess.run(command, capture_output=True, text=True, cwd=self.repo_root, check=False)
        self._cached_help_text = (completed.stdout or "") + (completed.stderr or "")
        return self._cached_help_text

    def unattended_flag(self) -> Optional[str]:
        if self._cached_flag is not None:
            return self._cached_flag
        help_text = self.help_text()
        self._cached_flag = detect_unattended_flag(
            help_text,
            self.cli_config.get(
                "unattended_flag_preference",
                ["--dangerously-bypass-approvals-and-sandbox", "--full-auto", "--yolo"],
            ),
        )
        return self._cached_flag

    def invoke(
        self,
        prompt: str,
        provider: ProviderSpec,
        output_jsonl_path: Path,
        last_message_path: Path,
        wall_seconds: int,
        idle_seconds: int,
    ) -> CodexInvocationResult:
        self.ensure_binary()
        output_jsonl_path.parent.mkdir(parents=True, exist_ok=True)
        last_message_path.parent.mkdir(parents=True, exist_ok=True)
        if output_jsonl_path.exists():
            output_jsonl_path.unlink()
        if last_message_path.exists():
            last_message_path.unlink()

        command = self.executable_command_prefix() + [provider.subcommand]
        unattended_flag = self.unattended_flag()
        if unattended_flag:
            command.append(unattended_flag)
        for raw_flag in provider.output_flags:
            if raw_flag not in command:
                command.append(raw_flag)
        directory_flag = provider.directory_flag if provider.directory_flag is not None else "-C"
        if directory_flag:
            command.extend([directory_flag, str(self.repo_root)])
        if provider.model:
            command.extend(["-m", provider.model])
        if provider.variant:
            command.extend(["--variant", provider.variant])
        for key, value in provider.config_overrides.items():
            command.extend(["-c", f"{key}={self._to_toml_literal(value)}"])
        output_last_message_flag = provider.last_message_flag
        if output_last_message_flag is None:
            output_last_message_flag = self.cli_config.get("output_last_message_flag", "-o")
        if output_last_message_flag:
            command.extend([output_last_message_flag, str(last_message_path)])
        if provider.prompt_style == "stdin":
            command.append("-")
        else:
            command.append(prompt)

        try:
            process = subprocess.Popen(
                command,
                cwd=self.repo_root,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                bufsize=1,
            )
        except OSError as exc:
            return CodexInvocationResult(
                ok=False,
                exit_code=None,
                timeout_type=None,
                final_message="",
                raw_output_path=output_jsonl_path,
                last_message_path=last_message_path,
                error_message=str(exc),
                command=command,
            )

        reader_queue: "queue.Queue[Optional[str]]" = queue.Queue()

        def reader() -> None:
            assert process.stdout is not None
            for line in iter(process.stdout.readline, ""):
                reader_queue.put(line)
            reader_queue.put(None)

        reader_thread = threading.Thread(target=reader, daemon=True)
        reader_thread.start()

        if process.stdin is not None:
            if provider.prompt_style == "stdin":
                process.stdin.write(prompt)
            process.stdin.close()

        started_at = time.monotonic()
        last_output_at = started_at
        stream_closed = False
        timed_out: Optional[str] = None

        with output_jsonl_path.open("w", encoding="utf-8") as handle:
            while True:
                try:
                    item = reader_queue.get(timeout=0.25)
                    if item is None:
                        stream_closed = True
                    else:
                        handle.write(item)
                        handle.flush()
                        last_output_at = time.monotonic()
                except queue.Empty:
                    pass

                now = time.monotonic()
                if process.poll() is None and wall_seconds and now - started_at > wall_seconds:
                    timed_out = "wall"
                    self._terminate_process(process)
                    break
                if process.poll() is None and idle_seconds and now - last_output_at > idle_seconds:
                    timed_out = "idle"
                    self._terminate_process(process)
                    break
                if process.poll() is not None and stream_closed:
                    break

        reader_thread.join(timeout=1)
        exit_code = process.poll()
        final_message = read_text(last_message_path).strip() if last_message_path.exists() else ""
        if not final_message:
            final_message = self.extract_final_message(output_jsonl_path)
            if final_message:
                write_text(last_message_path, final_message + "\n")
        ok = timed_out is None and exit_code == 0 and bool(final_message)
        error_message = ""
        if timed_out:
            error_message = f"Codex invocation timed out ({timed_out})."
        elif exit_code not in (0, None):
            error_message = f"Codex exited with code {exit_code}."
        elif not final_message:
            error_message = "Codex did not produce a final message."
        return CodexInvocationResult(
            ok=ok,
            exit_code=exit_code,
            timeout_type=timed_out,
            final_message=final_message,
            raw_output_path=output_jsonl_path,
            last_message_path=last_message_path,
            error_message=error_message,
            command=command,
        )

    @staticmethod
    def _terminate_process(process: subprocess.Popen[str]) -> None:
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=3)

    @staticmethod
    def _to_toml_literal(value: Any) -> str:
        if isinstance(value, bool):
            return "true" if value else "false"
        if value is None:
            return '""'
        if isinstance(value, (int, float)):
            return str(value)
        return json.dumps(str(value))

    @staticmethod
    def _extract_text_from_json(payload: Any) -> str:
        if isinstance(payload, str):
            return payload.strip()
        if isinstance(payload, list):
            for item in reversed(payload):
                candidate = CodexCLI._extract_text_from_json(item)
                if candidate:
                    return candidate
            return ""
        if not isinstance(payload, dict):
            return ""

        preferred_keys = (
            "final_message",
            "message",
            "text",
            "content",
            "output",
            "response",
            "assistant",
            "assistant_message",
            "completion",
        )
        for key in preferred_keys:
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

        for value in reversed(list(payload.values())):
            candidate = CodexCLI._extract_text_from_json(value)
            if candidate:
                return candidate
        return ""

    def extract_final_message(self, output_jsonl_path: Path) -> str:
        if not output_jsonl_path.exists():
            return ""
        lines = [line.strip() for line in read_text(output_jsonl_path).splitlines() if line.strip()]
        for line in reversed(lines):
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue
            candidate = self._extract_text_from_json(payload)
            if candidate:
                return candidate
        for line in reversed(lines):
            if line:
                return line
        return ""


class OrchestratorRunner:
    def __init__(
        self,
        repo_root: Path,
        orchestrator_root: Optional[Path] = None,
        config_path: Optional[Path] = None,
        cli: Optional[CodexCLI] = None,
    ):
        self.repo_root = repo_root.resolve()
        self.orchestrator_root = (orchestrator_root or self.repo_root / ".kanban2code" / "orchestrator").resolve()
        self.config_path = (config_path or self.orchestrator_root / "config.json").resolve()
        self.config = read_json(self.config_path)
        self.logs_root = self.orchestrator_root / "logs"
        self.runs_root = self.orchestrator_root / "runs"
        self.state_index_path = self.orchestrator_root / "state.json"
        self.agent_dir = self.repo_root / ".kanban2code" / "_agents"
        self.provider_dir = self.repo_root / ".kanban2code" / "_providers"
        self.cli = cli or CodexCLI(self.repo_root, self.config.get("cli_detection", {}))
        self.retain_recent_events = int(self.config.get("logging", {}).get("retain_recent_events", 20))
        self._agent_cache: Dict[str, Path] = {}

    def run_request(self, request_path: Path) -> Dict[str, Any]:
        request = read_json(request_path)
        run_state = self.initialize_run(request, request_path)
        self.append_event(run_state, "run_started", "Run started from request file.")
        self.process_run(run_state)
        return run_state

    def continue_run(self, run_id: Optional[str] = None, latest: bool = False) -> Dict[str, Any]:
        run_state = self.load_run_state(run_id=run_id, latest=latest)
        if run_state["status"] == "completed":
            self.write_summary(run_state)
            return run_state
        run_state["status"] = "running"
        self.append_event(run_state, "run_resumed", "Run resumed from persisted state.")
        self.process_run(run_state)
        return run_state

    def status(self, run_id: Optional[str] = None, latest: bool = False) -> str:
        run_state = self.load_run_state(run_id=run_id, latest=latest)
        summary_path = Path(run_state["summary_path"])
        if summary_path.exists():
            return read_text(summary_path)
        self.write_summary(run_state)
        return read_text(summary_path)

    def initialize_run(self, request: Dict[str, Any], request_path: Path) -> Dict[str, Any]:
        run_id = str(request.get("run_id") or f"run-{local_timestamp()}")
        run_state_path = self.runs_root / f"{run_id}.json"
        if run_state_path.exists():
            raise OrchestratorError(f"Run '{run_id}' already exists. Use continue instead.")

        queue_paths = self.resolve_queue(request)
        if not queue_paths:
            raise OrchestratorError("The run request did not resolve to any eligible tasks.")

        log_date = datetime.now().strftime(self.config.get("logging", {}).get("date_folder_format", "%Y-%m-%d"))
        log_dir = self.logs_root / log_date
        jsonl_path = log_dir / f"{run_id}.jsonl"
        summary_path = log_dir / f"{run_id}.md"
        human_readme_path = log_dir / f"{run_id}-human-readme.md"

        task_states = {
            stringify_path(path, self.repo_root): {
                "transport_attempts": {"plan": 0, "code": 0, "audit": 0},
                "audit_failures": 0,
                "status": "pending",
                "last_stage": None,
                "last_error": None,
                "last_rating": None,
                "last_verdict": None,
            }
            for path in queue_paths
        }

        run_state = {
            "schema_version": 1,
            "run_id": run_id,
            "created_at": str(request.get("created_at") or utc_now_iso()),
            "updated_at": utc_now_iso(),
            "status": "running",
            "repo_root": str(self.repo_root),
            "request_file": str(request_path.resolve()),
            "request": request,
            "targets": request.get("targets", []),
            "ordered_tasks": [stringify_path(path, self.repo_root) for path in queue_paths],
            "selected_stages": request.get("selected_stages") or ["plan", "code", "audit"],
            "resume_mode": request.get("resume_mode", "from-task-state"),
            "logging_mode": request.get("logging_mode", "json-and-markdown"),
            "stop_policy": request.get("stop_policy", {}),
            "provider_selection": self.resolve_provider_selection(request.get("provider_selection", {})),
            "timeout_overrides": request.get("timeout_overrides", {}),
            "retry_counters": request.get("retry_counters", {}),
            "current_index": 0,
            "current_task": None,
            "current_stage": None,
            "state_path": str(run_state_path),
            "jsonl_path": str(jsonl_path),
            "summary_path": str(summary_path),
            "human_readme_path": str(human_readme_path),
            "task_states": task_states,
            "recent_events": [],
            "last_error": None,
            "last_handoff_reason": None,
        }
        self.save_run_state(run_state)
        return run_state

    def resolve_provider_selection(self, request_selection: Dict[str, Any]) -> Dict[str, Any]:
        merged: Dict[str, Any] = {}
        config_selection = self.config.get("providers", {})
        for key, settings in config_selection.items():
            merged[key] = {
                "alias": settings.get("alias"),
                "model": settings.get("model"),
                "config_overrides": dict(settings.get("config_overrides", {})),
            }
        for key, settings in request_selection.items():
            merged.setdefault(key, {"alias": None, "model": None, "config_overrides": {}})
            if "alias" in settings:
                merged[key]["alias"] = settings["alias"]
            if "model" in settings:
                merged[key]["model"] = settings["model"]
            merged[key]["config_overrides"].update(settings.get("config_overrides", {}))
        return merged

    def resolve_queue(self, request: Dict[str, Any]) -> List[Path]:
        selected_stages = [stage.lower() for stage in request.get("selected_stages", ["plan", "code", "audit"])]
        raw_ordered_tasks = request.get("ordered_tasks") or []
        if raw_ordered_tasks:
            queue_paths = [self.resolve_repo_path(raw_path) for raw_path in raw_ordered_tasks]
            return self.filter_eligible_tasks(queue_paths, selected_stages)

        queue_paths: List[Path] = []
        seen: set[str] = set()
        for target in request.get("targets", []):
            target_type, target_path = self.resolve_target(target)
            if target_type == "task":
                task_path = self.resolve_repo_path(target_path)
                for candidate in self.filter_eligible_tasks([task_path], selected_stages):
                    key = stringify_path(candidate, self.repo_root)
                    if key not in seen:
                        seen.add(key)
                        queue_paths.append(candidate)
                continue
            folder_path = self.resolve_repo_path(target_path)
            if not folder_path.is_dir():
                raise OrchestratorError(f"Folder target does not exist: {folder_path}")
            discovered = sorted(
                [path for path in folder_path.rglob("task*.md") if path.name != "_context.md"],
                key=lambda path: task_sort_key(path, self.repo_root),
            )
            for candidate in self.filter_eligible_tasks(discovered, selected_stages):
                key = stringify_path(candidate, self.repo_root)
                if key not in seen:
                    seen.add(key)
                    queue_paths.append(candidate)
        return queue_paths

    def resolve_target(self, target: Any) -> Tuple[str, str]:
        if isinstance(target, str):
            resolved = self.resolve_repo_path(target)
            return ("folder" if resolved.is_dir() else "task", target)
        if not isinstance(target, dict) or "path" not in target:
            raise OrchestratorError("Every target must be a path string or an object with a 'path' key.")
        target_type = str(target.get("type") or "").strip().lower()
        raw_path = str(target["path"])
        if target_type in {"task", "folder"}:
            return target_type, raw_path
        resolved = self.resolve_repo_path(raw_path)
        return ("folder" if resolved.is_dir() else "task", raw_path)

    def filter_eligible_tasks(self, task_paths: Sequence[Path], selected_stages: Sequence[str]) -> List[Path]:
        eligible: List[Path] = []
        for task_path in task_paths:
            if not task_path.exists() or task_path.name == "_context.md":
                continue
            snapshot = self.read_task_snapshot(task_path)
            if snapshot.stage in selected_stages:
                eligible.append(task_path)
        return eligible

    def process_run(self, run_state: Dict[str, Any]) -> None:
        ordered_tasks = [self.resolve_repo_path(task_path) for task_path in run_state.get("ordered_tasks", [])]
        selected_stages = set(run_state.get("selected_stages", []))
        audit_handoff_cycles = int(self.config.get("retry_policy", {}).get("audit_failure_cycles_before_handoff", 2))
        transport_max_attempts = int(self.config.get("retry_policy", {}).get("transport_max_attempts", 3))

        while run_state["current_index"] < len(ordered_tasks):
            task_path = ordered_tasks[run_state["current_index"]]
            task_key = stringify_path(task_path, self.repo_root)
            task_state = run_state["task_states"].setdefault(
                task_key,
                {
                    "transport_attempts": {"plan": 0, "code": 0, "audit": 0},
                    "audit_failures": 0,
                    "status": "pending",
                    "last_stage": None,
                    "last_error": None,
                    "last_rating": None,
                    "last_verdict": None,
                },
            )
            snapshot = self.read_task_snapshot(task_path)
            run_state["current_task"] = task_key
            run_state["current_stage"] = snapshot.stage

            if snapshot.stage == "completed":
                task_state["status"] = "completed"
                run_state["current_index"] += 1
                self.append_event(run_state, "task_completed", f"Task already completed: {task_key}", task=task_key)
                continue

            if snapshot.stage not in selected_stages:
                task_state["status"] = "skipped"
                run_state["current_index"] += 1
                self.append_event(
                    run_state,
                    "task_skipped",
                    f"Task skipped because stage '{snapshot.stage}' is not selected.",
                    task=task_key,
                    stage=snapshot.stage,
                )
                continue

            if snapshot.stage not in self.config.get("stage_routing", {}):
                self.stop_for_human(
                    run_state,
                    snapshot,
                    reason="invalid_stage",
                    message=f"Task is in unsupported stage '{snapshot.stage}'.",
                    result=None,
                    failed_status="blocked",
                )
                return

            diagnostic_handoff = snapshot.stage == "audit" and int(task_state.get("audit_failures", 0)) >= audit_handoff_cycles
            result = self.execute_stage(task_path, run_state, task_state, diagnostic_handoff=diagnostic_handoff)
            task_state["last_stage"] = snapshot.stage

            if result.kind == "success":
                task_state["transport_attempts"][snapshot.stage] = 0
                task_state["last_error"] = None
                task_state["last_rating"] = result.rating
                task_state["last_verdict"] = result.verdict
                if result.stage_after == "completed":
                    task_state["status"] = "completed"
                    run_state["current_index"] += 1
                else:
                    task_state["status"] = "in_progress"
                self.append_event(
                    run_state,
                    "stage_success",
                    result.message,
                    task=task_key,
                    stage=snapshot.stage,
                    stage_after=result.stage_after,
                    agent_after=result.agent_after,
                    provider_key=result.provider_key,
                    provider_alias=result.provider_alias,
                    model=result.model,
                    exit_code=result.exit_code,
                    timeout_type=result.timeout_type,
                    raw_output_path=result.raw_output_path,
                    last_message_path=result.last_message_path,
                )
                continue

            if result.kind == "quality_failure":
                task_state["transport_attempts"]["audit"] = 0
                task_state["audit_failures"] = int(task_state.get("audit_failures", 0)) + 1
                task_state["status"] = "needs_rework"
                task_state["last_rating"] = result.rating
                task_state["last_verdict"] = result.verdict
                self.append_event(
                    run_state,
                    "audit_rework",
                    result.message,
                    task=task_key,
                    stage=snapshot.stage,
                    rating=result.rating,
                    verdict=result.verdict,
                    provider_key=result.provider_key,
                    provider_alias=result.provider_alias,
                    model=result.model,
                    raw_output_path=result.raw_output_path,
                    last_message_path=result.last_message_path,
                )
                continue

            if result.kind == "planner_blocked":
                self.stop_for_human(
                    run_state,
                    snapshot,
                    reason="planner_questions",
                    message=result.message,
                    result=result,
                    failed_status="blocked",
                )
                return

            if result.kind == "handoff_stop":
                self.stop_for_human(
                    run_state,
                    snapshot,
                    reason="audit_handoff",
                    message=result.message,
                    result=result,
                    failed_status="blocked",
                )
                return

            if result.kind == "transport_failure":
                task_state["transport_attempts"][snapshot.stage] = int(task_state["transport_attempts"].get(snapshot.stage, 0)) + 1
                task_state["last_error"] = result.message
                attempts = int(task_state["transport_attempts"][snapshot.stage])
                self.append_event(
                    run_state,
                    "stage_transport_failure",
                    result.message,
                    task=task_key,
                    stage=snapshot.stage,
                    attempts=attempts,
                    provider_key=result.provider_key,
                    provider_alias=result.provider_alias,
                    model=result.model,
                    exit_code=result.exit_code,
                    timeout_type=result.timeout_type,
                    raw_output_path=result.raw_output_path,
                    last_message_path=result.last_message_path,
                    command=result.command,
                )
                if attempts >= transport_max_attempts:
                    self.stop_for_human(
                        run_state,
                        snapshot,
                        reason="transport_failure_limit",
                        message=f"{result.message} Transport failure limit reached for stage '{snapshot.stage}'.",
                        result=result,
                        failed_status="failed",
                    )
                    return
                continue

            raise OrchestratorError(f"Unexpected stage result: {result.kind}")

        run_state["status"] = "completed"
        run_state["current_task"] = None
        run_state["current_stage"] = None
        self.append_event(run_state, "run_completed", "All queued tasks reached a terminal state.")

    def execute_stage(
        self,
        task_path: Path,
        run_state: Dict[str, Any],
        task_state: Dict[str, Any],
        diagnostic_handoff: bool = False,
    ) -> StageResult:
        before = self.read_task_snapshot(task_path)
        provider_key = self.select_provider_key(before.stage, task_state, diagnostic_handoff=diagnostic_handoff)
        provider = self.load_provider(provider_key, run_state.get("provider_selection", {}))
        prompt = self.build_prompt(before, run_state, provider_key, diagnostic_handoff=diagnostic_handoff)
        attempt_number = int(task_state.get("transport_attempts", {}).get(before.stage, 0)) + 1
        base_name = f"{run_state['run_id']}-{task_path.stem}-{before.stage}-attempt{attempt_number}"
        raw_output_path = Path(run_state["summary_path"]).parent / f"{base_name}-events.jsonl"
        last_message_path = Path(run_state["summary_path"]).parent / f"{base_name}-last-message.txt"
        stage_timeouts = self.resolve_stage_timeouts(before.stage, run_state.get("timeout_overrides", {}))
        invocation = self.cli.invoke(
            prompt,
            provider,
            output_jsonl_path=raw_output_path,
            last_message_path=last_message_path,
            wall_seconds=int(stage_timeouts["wall_seconds"]),
            idle_seconds=int(stage_timeouts["idle_seconds"]),
        )
        if not invocation.ok:
            return StageResult(
                kind="transport_failure",
                message=invocation.error_message or "Stage execution failed before completion.",
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                command=invocation.command,
            )

        after = self.read_task_snapshot(task_path)
        if diagnostic_handoff:
            review_data = extract_review_data(after.body)
            return StageResult(
                kind="handoff_stop",
                message="Final auditor diagnostic handoff completed. Queue is waiting for a human.",
                stage_after=after.stage,
                agent_after=after.agent,
                rating=review_data.get("rating"),
                verdict=review_data.get("verdict"),
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                review_excerpt=review_data.get("summary", ""),
                command=invocation.command,
            )

        if before.stage == "plan":
            return self.evaluate_planner_result(before, after, provider, invocation, raw_output_path, last_message_path)
        if before.stage == "code":
            return self.evaluate_coder_result(before, after, provider, invocation, raw_output_path, last_message_path)
        if before.stage == "audit":
            return self.evaluate_auditor_result(after, provider, invocation, raw_output_path, last_message_path)
        return StageResult(kind="transport_failure", message=f"Unsupported stage '{before.stage}'.")

    def evaluate_planner_result(
        self,
        before: TaskSnapshot,
        after: TaskSnapshot,
        provider: ProviderSpec,
        invocation: CodexInvocationResult,
        raw_output_path: Path,
        last_message_path: Path,
    ) -> StageResult:
        if has_blocking_questions(after.body) and after.stage == "plan":
            return StageResult(
                kind="planner_blocked",
                message="Planner added blocking questions and left the task in plan.",
                stage_after=after.stage,
                agent_after=after.agent,
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                command=invocation.command,
            )

        plan_config = self.config["stage_routing"]["plan"]
        if (
            after.stage == plan_config["success_stage"]
            and after.agent == plan_config["success_agent"]
            and all(has_section(after.body, heading) for heading in plan_config.get("required_sections", []))
        ):
            return StageResult(
                kind="success",
                message="Planner completed successfully and moved the task to code.",
                stage_after=after.stage,
                agent_after=after.agent,
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                command=invocation.command,
            )

        return StageResult(
            kind="transport_failure",
            message="Planner finished without producing the expected task transition.",
            provider_key=provider.provider_key,
            provider_alias=provider.alias,
            model=provider.model,
            exit_code=invocation.exit_code,
            timeout_type=invocation.timeout_type,
            final_message=invocation.final_message,
            raw_output_path=str(raw_output_path),
            last_message_path=str(last_message_path),
            command=invocation.command,
        )

    def evaluate_coder_result(
        self,
        before: TaskSnapshot,
        after: TaskSnapshot,
        provider: ProviderSpec,
        invocation: CodexInvocationResult,
        raw_output_path: Path,
        last_message_path: Path,
    ) -> StageResult:
        code_config = self.config["stage_routing"]["code"]
        if (
            after.stage == code_config["success_stage"]
            and after.agent == code_config["success_agent"]
            and all(has_section(after.body, heading) for heading in code_config.get("required_sections", []))
            and after.text != before.text
        ):
            return StageResult(
                kind="success",
                message="Coder completed successfully and moved the task to audit.",
                stage_after=after.stage,
                agent_after=after.agent,
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                command=invocation.command,
            )

        return StageResult(
            kind="transport_failure",
            message="Coder finished without producing the expected audit transition.",
            provider_key=provider.provider_key,
            provider_alias=provider.alias,
            model=provider.model,
            exit_code=invocation.exit_code,
            timeout_type=invocation.timeout_type,
            final_message=invocation.final_message,
            raw_output_path=str(raw_output_path),
            last_message_path=str(last_message_path),
            command=invocation.command,
        )

    def evaluate_auditor_result(
        self,
        after: TaskSnapshot,
        provider: ProviderSpec,
        invocation: CodexInvocationResult,
        raw_output_path: Path,
        last_message_path: Path,
    ) -> StageResult:
        audit_config = self.config["stage_routing"]["audit"]
        review_data = extract_review_data(after.body)
        rating = review_data.get("rating")
        verdict = review_data.get("verdict")
        if rating is None or verdict is None or not has_section(after.body, "## Review"):
            return StageResult(
                kind="transport_failure",
                message="Auditor finished without producing a valid review section.",
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                command=invocation.command,
            )

        if rating >= int(audit_config["accepted_rating"]) and after.stage == audit_config["accepted_stage"]:
            return StageResult(
                kind="success",
                message=f"Auditor accepted the task with rating {rating}/10.",
                stage_after=after.stage,
                agent_after=after.agent,
                rating=rating,
                verdict=verdict,
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                review_excerpt=review_data.get("summary", ""),
                command=invocation.command,
            )

        if rating < int(audit_config["accepted_rating"]) and after.stage == audit_config["rework_stage"] and after.agent == audit_config["rework_agent"]:
            return StageResult(
                kind="quality_failure",
                message=f"Auditor requested rework with rating {rating}/10.",
                stage_after=after.stage,
                agent_after=after.agent,
                rating=rating,
                verdict=verdict,
                provider_key=provider.provider_key,
                provider_alias=provider.alias,
                model=provider.model,
                exit_code=invocation.exit_code,
                timeout_type=invocation.timeout_type,
                final_message=invocation.final_message,
                raw_output_path=str(raw_output_path),
                last_message_path=str(last_message_path),
                review_excerpt=review_data.get("summary", ""),
                command=invocation.command,
            )

        return StageResult(
            kind="transport_failure",
            message="Auditor review did not match the expected metadata transition.",
            provider_key=provider.provider_key,
            provider_alias=provider.alias,
            model=provider.model,
            exit_code=invocation.exit_code,
            timeout_type=invocation.timeout_type,
            final_message=invocation.final_message,
            raw_output_path=str(raw_output_path),
            last_message_path=str(last_message_path),
            command=invocation.command,
        )

    def stop_for_human(
        self,
        run_state: Dict[str, Any],
        snapshot: TaskSnapshot,
        reason: str,
        message: str,
        result: Optional[StageResult],
        failed_status: str,
    ) -> None:
        task_key = stringify_path(snapshot.path, self.repo_root)
        run_state["status"] = failed_status
        run_state["last_error"] = message
        run_state["last_handoff_reason"] = reason
        human_content = self.render_handoff(run_state, snapshot, reason, message, result)
        write_text(Path(run_state["human_readme_path"]), human_content)
        self.append_event(
            run_state,
            "run_handoff",
            message,
            task=task_key,
            stage=snapshot.stage,
            reason=reason,
            provider_key=result.provider_key if result else None,
            provider_alias=result.provider_alias if result else None,
            model=result.model if result else None,
            rating=result.rating if result else None,
            verdict=result.verdict if result else None,
            raw_output_path=result.raw_output_path if result else None,
            last_message_path=result.last_message_path if result else None,
        )

    def load_provider(self, provider_key: str, provider_selection: Dict[str, Any]) -> ProviderSpec:
        if provider_key not in provider_selection:
            raise OrchestratorError(f"Missing provider configuration for '{provider_key}'.")
        provider_policy = self.config.get("providers", {}).get(provider_key, {})
        selection = provider_selection[provider_key]
        alias = str(selection.get("alias") or provider_key)
        provider_file = self.provider_dir / f"{alias}.md"
        if not provider_file.exists():
            raise OrchestratorError(f"Provider file not found: {provider_file}")
        metadata, _ = split_frontmatter(read_text(provider_file))
        model = str(selection.get("model") or metadata.get("model") or "")
        config_overrides = dict(metadata.get("config_overrides", {}))
        config_overrides.update(selection.get("config_overrides", {}))
        self.validate_provider_usage_rules(
            provider_key=provider_key,
            alias=alias,
            model=model,
            config_overrides=config_overrides,
            provider_policy=provider_policy,
        )
        return ProviderSpec(
            provider_key=provider_key,
            alias=alias,
            cli=str(metadata.get("cli", "codex")),
            subcommand=str(metadata.get("subcommand", "exec")),
            model=model,
            prompt_style=str(metadata.get("prompt_style", "stdin")),
            output_flags=list(metadata.get("output_flags", [])),
            unattended_flags=list(metadata.get("unattended_flags", [])),
            config_overrides=config_overrides,
            directory_flag=(
                None if "dir_flag" not in metadata or metadata.get("dir_flag") in (None, "") else str(metadata.get("dir_flag"))
            ),
            last_message_flag=(
                None if "last_message_flag" not in metadata else (
                    "" if metadata.get("last_message_flag") in (None, "") else str(metadata.get("last_message_flag"))
                )
            ),
            variant=(
                None if "variant" not in metadata or metadata.get("variant") in (None, "") else str(metadata.get("variant"))
            ),
        )

    def validate_provider_usage_rules(
        self,
        provider_key: str,
        alias: str,
        model: str,
        config_overrides: Dict[str, Any],
        provider_policy: Dict[str, Any],
    ) -> None:
        rules = dict(provider_policy.get("rules", {}))
        problems: List[str] = []

        if rules.get("require_exact_alias", False):
            expected_alias = str(provider_policy.get("alias") or provider_key)
            if alias != expected_alias:
                problems.append(f"alias must be '{expected_alias}' (got '{alias}')")

        if rules.get("require_exact_model", False):
            expected_model = str(provider_policy.get("model") or "")
            if model != expected_model:
                problems.append(f"model must be '{expected_model}' (got '{model}')")

        required_overrides = dict(rules.get("required_config_overrides", {}))
        for key, expected_value in required_overrides.items():
            actual_value = config_overrides.get(key)
            if actual_value != expected_value:
                problems.append(
                    f"config override '{key}' must be '{expected_value}' (got '{actual_value}')"
                )

        if problems:
            joined = "; ".join(problems)
            raise OrchestratorError(f"Provider selection for '{provider_key}' violates model usage rules: {joined}")

    def select_provider_key(self, stage: str, task_state: Dict[str, Any], diagnostic_handoff: bool = False) -> str:
        if stage == "plan":
            return "planner"
        if stage == "code":
            return "coder"
        if stage == "audit":
            if diagnostic_handoff or int(task_state.get("transport_attempts", {}).get("audit", 0)) > 0:
                return "auditor_escalation"
            return "auditor"
        raise OrchestratorError(f"Unsupported stage '{stage}'.")

    def resolve_stage_timeouts(self, stage: str, timeout_overrides: Dict[str, Any]) -> Dict[str, Any]:
        base = dict(self.config.get("timeouts", {}).get(stage, {}))
        overrides = timeout_overrides.get(stage, {})
        base.update(overrides)
        return base

    def build_prompt(
        self,
        snapshot: TaskSnapshot,
        run_state: Dict[str, Any],
        provider_key: str,
        diagnostic_handoff: bool = False,
    ) -> str:
        agent_name = self.config["stage_routing"][snapshot.stage]["agent"]
        agent_file = self.find_agent_file(agent_name)
        agent_text = read_text(agent_file)
        if agent_name == "planner":
            agent_text = remove_section(agent_text, "First contact")
        expected_transition = self.expected_transition_text(snapshot.stage)
        prompt_lines = [
            f"You are executing the Kanban2Code {agent_name} stage for run '{run_state['run_id']}'.",
            f"Repository root: {self.repo_root}",
            f"Task file: {stringify_path(snapshot.path, self.repo_root)}",
            f"Current task stage: {snapshot.stage}",
            f"Expected transition: {expected_transition}",
            f"Structured event log: {run_state['jsonl_path']}",
            f"Selected provider key: {provider_key}",
            "Use the agent file below as the source of truth for behavior and constraints.",
            "This is an execution run, not a chat-only run.",
            f"You must read and edit the real task file on disk at '{snapshot.path}'.",
            "Do not only respond with a summary or the first-contact line.",
            "Use the repository files and available tools as needed, then persist the required task-file updates before you finish.",
            "Your final message can stay minimal, but the task file on disk must reflect the completed stage work.",
        ]
        if diagnostic_handoff:
            prompt_lines.extend(
                [
                    "This is a final auditor diagnostic handoff pass.",
                    "Audit thoroughly, explain the blocker clearly for a human, and assume the queue stops after this run.",
                ]
            )
        prompt_lines.extend(
            [
                "",
                "[Agent File]",
                agent_text.strip(),
                "",
                "[Task File]",
                snapshot.text.strip(),
                "",
            ]
        )
        return "\n".join(prompt_lines)

    def expected_transition_text(self, stage: str) -> str:
        if stage == "plan":
            return "Move task metadata to stage: code and agent: coder, unless blocking questions are required."
        if stage == "code":
            return "Move task metadata to stage: audit and agent: auditor only when implementation is ready."
        if stage == "audit":
            return "Move task metadata to completed when accepted, or back to code when rework is required."
        return "Unknown"

    def find_agent_file(self, agent_name: str) -> Path:
        if agent_name in self._agent_cache:
            return self._agent_cache[agent_name]
        for path in sorted(self.agent_dir.glob("*.md")):
            metadata, _ = split_frontmatter(read_text(path))
            if str(metadata.get("name", "")).strip().lower() == agent_name.lower():
                self._agent_cache[agent_name] = path
                return path
        raise OrchestratorError(f"Could not find agent file for '{agent_name}'.")

    def read_task_snapshot(self, task_path: Path) -> TaskSnapshot:
        text = read_text(task_path)
        metadata, body = split_frontmatter(text)
        return TaskSnapshot(path=task_path.resolve(), metadata=metadata, body=body, text=text)

    def resolve_repo_path(self, raw_path: str) -> Path:
        candidate = Path(raw_path)
        if candidate.is_absolute():
            return candidate.resolve()
        return (self.repo_root / candidate).resolve()

    def append_event(self, run_state: Dict[str, Any], event_type: str, message: str, **extra: Any) -> None:
        event = {
            "timestamp": utc_now_iso(),
            "type": event_type,
            "message": message,
            "run_id": run_state["run_id"],
        }
        for key, value in extra.items():
            if value is not None:
                event[key] = value
        jsonl_path = Path(run_state["jsonl_path"])
        jsonl_path.parent.mkdir(parents=True, exist_ok=True)
        with jsonl_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, sort_keys=True) + "\n")
        recent_events = run_state.setdefault("recent_events", [])
        recent_events.append(event)
        run_state["recent_events"] = recent_events[-self.retain_recent_events :]
        run_state["updated_at"] = utc_now_iso()
        self.save_run_state(run_state)
        self.write_summary(run_state)

    def save_run_state(self, run_state: Dict[str, Any]) -> None:
        run_state_path = Path(run_state["state_path"])
        write_json(run_state_path, run_state)
        state_index = {"latest_run_id": run_state["run_id"], "runs": {}}
        if self.state_index_path.exists():
            state_index = read_json(self.state_index_path)
        state_index["latest_run_id"] = run_state["run_id"]
        state_index.setdefault("runs", {})
        state_index["runs"][run_state["run_id"]] = {
            "state_path": str(run_state_path),
            "summary_path": run_state["summary_path"],
            "status": run_state["status"],
            "updated_at": run_state["updated_at"],
            "human_readme_path": run_state["human_readme_path"],
        }
        write_json(self.state_index_path, state_index)

    def load_run_state(self, run_id: Optional[str] = None, latest: bool = False) -> Dict[str, Any]:
        if not self.state_index_path.exists():
            raise OrchestratorError("No orchestrator state file exists yet.")
        index_payload = read_json(self.state_index_path)
        selected_run_id = run_id
        if latest or not selected_run_id:
            selected_run_id = index_payload.get("latest_run_id")
        if not selected_run_id:
            raise OrchestratorError("No run id is available in orchestrator state.")
        runs = index_payload.get("runs", {})
        if selected_run_id not in runs:
            raise OrchestratorError(f"Run '{selected_run_id}' is not tracked in orchestrator state.")
        return read_json(Path(runs[selected_run_id]["state_path"]))

    def write_summary(self, run_state: Dict[str, Any]) -> None:
        write_text(Path(run_state["summary_path"]), self.render_summary(run_state))

    def render_summary(self, run_state: Dict[str, Any]) -> str:
        ordered_tasks = run_state.get("ordered_tasks", [])
        task_states = run_state.get("task_states", {})
        completed = sum(1 for key in ordered_tasks if task_states.get(key, {}).get("status") == "completed")
        blocked = run_state["status"] in {"blocked", "failed"}
        lines = [
            f"# Orchestrator Run {run_state['run_id']}",
            "",
            f"- Status: {run_state['status']}",
            f"- Created: {run_state['created_at']}",
            f"- Updated: {run_state['updated_at']}",
            f"- Queue length: {len(ordered_tasks)}",
            f"- Completed tasks: {completed}",
            f"- Current task: {run_state.get('current_task') or 'none'}",
            f"- Current stage: {run_state.get('current_stage') or 'none'}",
        ]
        if blocked:
            lines.append(f"- Human handoff: {run_state['human_readme_path']}")
        lines.extend(["", "## Queue"])
        for index, task_key in enumerate(ordered_tasks):
            marker = "x" if task_states.get(task_key, {}).get("status") == "completed" else ">"
            if index > run_state.get("current_index", 0) and marker != "x":
                marker = " "
            task_status = task_states.get(task_key, {}).get("status", "pending")
            audit_failures = task_states.get(task_key, {}).get("audit_failures", 0)
            lines.append(f"- [{marker}] {task_key} | status: {task_status} | audit_failures: {audit_failures}")
        lines.extend(["", "## Recent Events"])
        for event in run_state.get("recent_events", []):
            lines.append(f"- {event['timestamp']} | {event['type']} | {event['message']}")
        lines.append("")
        return "\n".join(lines)

    def render_handoff(
        self,
        run_state: Dict[str, Any],
        snapshot: TaskSnapshot,
        reason: str,
        message: str,
        result: Optional[StageResult],
    ) -> str:
        task_key = stringify_path(snapshot.path, self.repo_root)
        task_state = run_state.get("task_states", {}).get(task_key, {})
        attempts = task_state.get("transport_attempts", {})
        recommended_action = self.recommended_action(reason)
        lines = [
            f"# Human Handoff for {run_state['run_id']}",
            "",
            f"- Status: {run_state['status']}",
            f"- Task: {task_key}",
            f"- Stage: {snapshot.stage}",
            f"- Reason: {reason}",
            f"- Message: {message}",
            f"- Provider key: {result.provider_key if result else 'n/a'}",
            f"- Provider alias: {result.provider_alias if result else 'n/a'}",
            f"- Model: {result.model if result else 'n/a'}",
            f"- Last exit code: {result.exit_code if result else 'n/a'}",
            f"- Timeout: {result.timeout_type if result else 'n/a'}",
            f"- Transport attempts: {json.dumps(attempts, sort_keys=True)}",
            f"- Audit failures: {task_state.get('audit_failures', 0)}",
            f"- Rating: {result.rating if result and result.rating is not None else 'n/a'}",
            f"- Verdict: {result.verdict if result and result.verdict else 'n/a'}",
            "",
            "## Recommended Next Action",
            recommended_action,
        ]
        if result and result.review_excerpt:
            lines.extend(["", "## Latest Review Summary", result.review_excerpt])
        if result and result.raw_output_path:
            lines.extend(["", "## Artifacts", f"- Raw output: {result.raw_output_path}", f"- Final message: {result.last_message_path}"])
        lines.append("")
        return "\n".join(lines)

    @staticmethod
    def recommended_action(reason: str) -> str:
        if reason == "planner_questions":
            return "Answer the planner questions in the task file, then rerun `continue --latest`."
        if reason == "audit_handoff":
            return "Review the audit findings, update the task or code manually, then rerun `continue --latest`."
        if reason == "transport_failure_limit":
            return "Inspect the Codex CLI installation, authentication, network connectivity, or prompt behavior before continuing."
        if reason == "invalid_stage":
            return "Move the task to a supported stage (`plan`, `code`, or `audit`) before continuing."
        return "Inspect the queue state, make the required fix, then rerun `continue --latest`."


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Kanban2Code orchestrator runner")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Run a queue from a request file")
    run_parser.add_argument("--request-file", required=True, help="Path to run-request.json")

    status_parser = subparsers.add_parser("status", help="Show the latest or a specific run summary")
    status_group = status_parser.add_mutually_exclusive_group(required=True)
    status_group.add_argument("--latest", action="store_true")
    status_group.add_argument("--run-id")

    continue_parser = subparsers.add_parser("continue", help="Continue a persisted run")
    continue_group = continue_parser.add_mutually_exclusive_group(required=True)
    continue_group.add_argument("--latest", action="store_true")
    continue_group.add_argument("--run-id")
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = build_argument_parser()
    args = parser.parse_args(argv)
    repo_root = Path(__file__).resolve().parents[2]
    runner = OrchestratorRunner(repo_root=repo_root)
    try:
        if args.command == "run":
            run_state = runner.run_request(Path(args.request_file))
            sys.stdout.write(read_text(Path(run_state["summary_path"])))
            return 0
        if args.command == "status":
            sys.stdout.write(runner.status(run_id=args.run_id, latest=args.latest))
            return 0
        if args.command == "continue":
            run_state = runner.continue_run(run_id=args.run_id, latest=args.latest)
            sys.stdout.write(read_text(Path(run_state["summary_path"])))
            return 0
    except OrchestratorError as exc:
        parser.error(str(exc))
    return 1


if __name__ == "__main__":
    sys.exit(main())
