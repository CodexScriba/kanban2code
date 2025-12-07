---
stage: plan
title: Implement XML prompt builder (9-layer context)
tags:
  - mvp
  - context
  - prompts
created: 2025-12-07T00:00:00Z
---

# Implement XML Prompt Builder (9-Layer Context)

## Goal
Assemble a complete XML prompt for a task, following the defined context order.

## Scope
- Implement `promptBuilder.buildXMLPrompt(task, root): Promise<string>`.
- Assembly order:
  1. `how-it-works.md`
  2. `architecture.md`
  3. `project-details.md`
  4. `_agents/{agent}.md` (if `agent` is set)
  5. `projects/{project}/_context.md` (if project)
  6. `projects/{project}/{phase}/_context.md` (if phase)
  7. `_templates/stages/{stage}.md`
  8. Custom contexts from `contexts:`
  9. Task body + metadata
- Wrap in `<system>`, `<context>`, `<task>` XML structure.

## Notes
Keep formatting clean and model-friendly; avoid unnecessary whitespace noise.