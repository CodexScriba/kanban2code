---
stage: plan
title: Implement context file loaders
tags:
  - mvp
  - context
  - filesystem
created: 2025-12-07T00:00:00Z
---

# Implement Context File Loaders

## Goal
Provide simple helpers for loading all context layers used in prompts.

## Scope
- In `contextService.ts`, implement:
  - `loadGlobalContext(root)` → `how-it-works.md`, `architecture.md`, `project-details.md`.
  - `loadAgentContext(root, agentName)`.
  - `loadProjectContext(root, projectName)`.
  - `loadPhaseContext(root, projectName, phaseName)`.
  - `loadCustomContexts(root, contextNames[])`.
- Return empty strings or `null` for missing files, never crash.

## Notes
These helpers will feed into the XML prompt builder.