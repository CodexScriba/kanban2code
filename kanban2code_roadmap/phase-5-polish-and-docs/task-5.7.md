---
stage: plan
title: Define formal tag taxonomy and conventions
tags:
  - mvp
  - docs
  - taxonomy
created: 2025-12-07T00:00:00Z
---

# Define Formal Tag Taxonomy and Conventions

## Goal
Establish clear, consistent tagging system for tasks to improve organization and filtering.

## Scope
- Create tag taxonomy documentation in `how-it-works.md`:
  - **Scope**: mvp, post-v1
  - **Type**: bug, feature, spike, idea, roadmap
  - **Domain**: infra, ui, context, board, filesystem
  - **Priority**: urgent (optional)
- Update task creation UI to:
  - Provide tag suggestions based on taxonomy
  - Allow free-text entry with autocomplete
  - Visual distinction between tag categories
- Update filtering system to support tag categories:
  - Filter by scope (MVP vs post-v1)
  - Filter by type (bugs only, features only)
  - Filter by domain (infra tasks, UI tasks)

## Notes
Tags should be an input field for users to type if that helps their workflow, but taxonomy provides structure and consistency.