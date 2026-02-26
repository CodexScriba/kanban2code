---
stage: plan
tags: [feature, p1]
agent: planner
contexts: []
---

# Task File Generator

## Goal
When the orchestrator proposes a task, one function writes the .md file with correct frontmatter and returns the file path.

## Definition of Done
- [ ] Parsing a mock orchestrator response produces a valid .md file that parseTaskFile() reads back without errors.

## Files
- `src/services/task-generator.ts` - create - parseTaskProposal, generateTaskFile
- `src/types/task-proposal.ts` - create - TaskProposal interface

## Tests
- [ ] tests/task-generator.test.ts - parse proposal from mock response, verify written file has correct frontmatter