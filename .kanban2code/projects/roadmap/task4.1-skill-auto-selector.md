---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Skill Auto-Selector

## Goal
Given conversation text and the current workspace, return the right skill files to attach to the orchestrator call.

## Definition of Done
- [ ] Given a Next.js workspace and "add dashboard with caching", returns nextjs-core-skills.md + skill-caching-data-fetching.md in the right order.

## Files
- `src/services/skill-selector.ts` - create - detectFrameworks, selectSkills, loadSkillContents
- `src/types/skill.ts` - create - SelectedSkill interface, SkillsIndex schema

## Tests
- [ ] tests/skill-selector.test.ts - unit tests for framework detection, keyword matching, ordering