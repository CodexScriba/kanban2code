---
stage: plan
title: Implement stage template resolution
tags:
  - mvp
  - context
  - templates
created: 2025-12-07T00:00:00Z
---

# Implement Stage Template Resolution

## Goal
Load the correct stage template for a task's current stage.

## Scope
- Implement `loadStageTemplate(root, stage)`:
  - Resolve `_templates/stages/{stage}.md`.
  - Read file content or return a minimal fallback template if missing.
- Integrate this into the XML prompt builder so every prompt gets stage-specific guidance.

## Notes
These templates define "what to do at this stage" for the AI agent.