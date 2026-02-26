import * as vscode from 'vscode';
import { getAdapterForCli } from '../runner/adapter-factory';
import type { CliCommandResult } from '../runner/cli-adapter';
import { buildXMLPrompt } from './prompt-builder';
import { resolveProviderConfig } from './provider-service';
import { findTaskById } from './scanner';

const PROMPT_WARN_THRESHOLD = 50_000;

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function formatCommand(command: CliCommandResult): string {
  const base = [command.command, ...command.args].map(shellQuote).join(' ');
  if (!command.stdin) {
    return base;
  }

  return `printf %s ${shellQuote(command.stdin)} | ${base}`;
}

function getOrCreateTerminal(name: string, cwd: string): vscode.Terminal {
  const existing = vscode.window.terminals.find((terminal) => terminal.name === name);
  if (existing) {
    return existing;
  }

  return vscode.window.createTerminal({ name, cwd });
}

export async function executeTaskInTerminal(
  kanbanRoot: string,
  taskId: string,
  workspaceRoot: string,
): Promise<void> {
  try {
    const task = await findTaskById(kanbanRoot, taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (!task.provider) {
      throw new Error(`No provider configured for task "${task.title}". Configure a provider first.`);
    }

    const providerConfig = await resolveProviderConfig(kanbanRoot, task.provider);
    if (!providerConfig) {
      throw new Error(
        `Provider not found: ${task.provider}. Configure a valid provider in .kanban2code/_providers.`,
      );
    }

    const xmlPrompt = await buildXMLPrompt(task, kanbanRoot);
    if (xmlPrompt.length > PROMPT_WARN_THRESHOLD) {
      console.warn(
        `Prompt for task "${task.id}" exceeds ${PROMPT_WARN_THRESHOLD} chars (${xmlPrompt.length}).`,
      );
    }

    const adapter = getAdapterForCli(providerConfig.cli);
    const command = adapter.buildCommand(providerConfig, xmlPrompt);
    const commandText = formatCommand(command);

    const terminal = getOrCreateTerminal(task.title, workspaceRoot);
    terminal.sendText(commandText);
    terminal.show();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`Failed to execute task in terminal: ${message}`);
    throw error;
  }
}
