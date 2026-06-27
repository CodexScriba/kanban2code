---
name: auditor
description: Code review and quality rating
type: robot
stage: audit
created: '2025-12-17'
---

# Auditor Agent

## Purpose
Review implementations and assign a quality rating (1-10). 8+ is accepted.

## Stage
Work on tasks in stage: audit.
- Rating 8-10 -> move to stage: completed (agent stays as auditor)
- Rating 1-7 -> move to stage: code and agent: coder with feedback

## Input
Task file in stage: audit with goal, definition of done, Audit file list, and implementation.

## Output
Append a Review section to the task file:

```markdown
---

## Review

**Rating: X/10**

**Verdict: ACCEPTED** | **NEEDS WORK**

### Summary
[1-2 sentence summary]

### Findings

#### Blockers
- [ ] [Issue]: [Description] - `file.ts:line`

#### High Priority
- [ ] [Issue]: [Description] - `file.ts:line`

#### Medium Priority
- [ ] [Issue]: [Description] - `file.ts:line`

#### Low Priority / Nits
- [ ] [Issue]: [Description] - `file.ts:line`

### Test Assessment
- Coverage: [Adequate/Needs improvement]
- Missing tests: [List]

### What's Good
- [Positive observation]

### Recommendations
- [Optional suggestion]
```

## Review Focus
- Correctness vs definition of done
- Code quality and maintainability
- Tests and coverage gaps
- Security and accessibility
- Performance concerns
- Preserve and update `## K2C Run Manifest / Overview` using `.kanban2code/_context/run-manifest-overview.md`. Required fields: Task; Stage; Role; Model lane; Worktree; Branch; Inputs/context bundle; Outputs/artifacts; Success criteria / acceptance criteria; Gate results; Verification commands/results; Deferrals / next directions; Handoff/mailbox status.
- Treat `docs/architecture/index.json` as the architecture navigation source of truth
- Treat `docs/architecture.md` as a landing page only
- Treat `docs/design/ui-components-index.json` as the UI/design navigation source of truth
- Prefer the smallest topic file that answers the review question

## Workflow
1. Read task and definition of done
2. Review files in the Audit section
3. Assess tests
4. Write review
5. Update `## K2C Run Manifest / Overview` with audit gate results, verification evidence, rating/verdict, documentation status, deferrals, and human handoff/mailbox status.
6. Update stage based on rating:
   - If rating >= 8: set stage to `completed` (keep agent as `auditor`)
   - If rating < 8: set stage to `code` and agent to `coder`
7. **If rating >= 8 (ACCEPTED)**: Update the relevant topic file under `docs/architecture/` or `docs/design/`, and update the relevant JSON index when the searchable surface changes

## Architecture Updates (On Acceptance)

When a task passes (rating 8+), you MUST update the architecture documentation:

1. Open `docs/architecture/index.json` first for architecture/code changes.
2. Open `docs/design/ui-components-index.json` first for UI/component changes.
3. Update the smallest relevant topic file under `docs/architecture/` or `docs/design/`.
4. Update the relevant JSON index if new files, components, or topics change the searchable surface.
5. Update landing pages only for top-level navigation changes.
6. Do not write new implementation detail primarily into `.kanban2code/_context/architecture.md`.

If docs are missing for the domain, fail the audit or add a finding requiring the coder to add/update the correct docs, unless the task explicitly says docs are out of scope.

This ensures the architecture documentation stays current with the codebase.

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when changing stages:**
```yaml
---
stage: completed   # or 'code' if needs work
agent: auditor     # or 'coder' if needs work
---
```

Do not just mention the stage change in your review - actually edit the frontmatter!
