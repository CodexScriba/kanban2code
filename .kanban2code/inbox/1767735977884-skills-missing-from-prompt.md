---
stage: completed
agent: auditor
tags: []
contexts: []
skills: []
---

# Skills missing from prompt

When skills are selected, I want them to be included in the original prompt when i click the main copy xml button.

Clicking cancel or the "x" when I'm editing I cannot close it, only when I pressed esc it works.

Context files and skills should be added to the original prompt at all times

## Refined Prompt

Objective: Fix skills inclusion in copied XML prompts and modal close button functionality

Implementation approach:
1. Create `loadSkills` function in `src/services/context.ts` that loads skill files from `_context/skills/` directory (similar to `loadCustomContexts`)
2. Update `buildContextSection` in `src/services/prompt-builder.ts` to call `loadSkills` with `task.skills` and include the returned content in the context layers
3. Fix TaskEditorModal close button in `src/webview/ui/components/TaskEditorModal.tsx` - investigate why close button click handler isn't properly closing the modal (ESC works but buttons don't)

Key decisions:
- Skills should be loaded using the same pattern as custom contexts (read files, wrap in section)
- Add skills as a new context layer in the prompt builder (e.g., `wrapSection('skills', skillsContent)`)
- Modal close button issue may be related to event propagation or state management - need to debug why `requestClose` isn't being triggered properly

Edge cases:
- Task with no skills selected: `loadSkills` should return empty string
- Task with no contexts selected: existing behavior should be preserved
- Skills directory doesn't exist: should return empty string gracefully
- Skills with `always_attach: true` in frontmatter: should these be auto-included even if not selected? (currently not implemented, may be future enhancement)

## Context

### Relevant Code
- [`src/services/prompt-builder.ts:44-68`](src/services/prompt-builder.ts:44) - `buildContextSection` function that loads context layers, currently loads global, agent, project, phase, and custom contexts but NOT skills
- [`src/services/context.ts:478-504`](src/services/context.ts:478) - `loadCustomContexts` function that loads context files, serves as pattern for `loadSkills`
- [`src/services/context.ts:112-191`](src/services/context.ts:112) - `listAvailableSkills` function that lists skills, shows skills are in `_context/skills/` directory
- [`src/types/task.ts:14`](src/types/task.ts:14) - Task interface includes `skills?: string[]` field
- [`src/webview/ui/components/TaskEditorModal.tsx:98-105`](src/webview/ui/components/TaskEditorModal.tsx:98) - `requestClose` function that handles modal closing
- [`src/webview/ui/components/TaskEditorModal.tsx:281`](src/webview/ui/components/TaskEditorModal.tsx:281) - Close button that calls `requestClose`
- [`src/webview/ui/components/TaskContextMenu.tsx:64`](src/webview/ui/components/TaskContextMenu.tsx:64) - "Copy XML (Full Context)" menu item that sends CopyContext message

### Patterns to Follow
- `loadCustomContexts` pattern: iterate through skill IDs, read files using `readFileIfExists`, join with newlines, filter empty results
- Skills are stored in `_context/skills/` directory with `.md` extension (see [`listAvailableSkills`](src/services/context.ts:112))
- Use `wrapSection` helper to wrap skills content in XML section tag

### Test Patterns
- Look at [`tests/context-service.test.ts`](tests/context-service.test.ts) for context loading tests
- Look at [`tests/prompt-builder.test.ts`](tests/prompt-builder.test.ts) for prompt building tests

### Dependencies
- `fs/promises` for file reading
- `path` for path manipulation
- `matter` (gray-matter) for parsing skill frontmatter (if needed)
- Existing `loadCustomContexts` function as reference

### Gotchas
- Skills may have relative paths or just IDs - need to handle both cases like `loadCustomContexts` does
- Skills directory may not exist - handle gracefully with try/catch
- Ensure skills are loaded in parallel with other contexts for performance (use `Promise.all`)
- Modal close button issue: check if event propagation is being stopped, or if the button click handler is being overridden by something else
- The close button has `onClick={requestClose}` which should work - investigate if there's a z-index issue or if the overlay is capturing the click

## Audit

### Files Modified
- src/services/context.ts
- src/services/prompt-builder.ts
- src/webview/ui/components/TaskEditorModal.tsx
- tests/context-service.test.ts
- tests/prompt-builder.test.ts

### Changes Summary
1. **src/services/context.ts**: Added `loadSkills` function (lines 506-534) that loads skill files from `_context/skills/` directory by skill ID, handling both simple IDs and nested paths.

2. **src/services/prompt-builder.ts**: Updated import to include `loadSkills`, modified `buildContextSection` to call `loadSkills(root, task.skills)` in parallel with other context loaders, and added skills as a new context layer using `wrapSection('skills', skills)`.

3. **src/webview/ui/components/TaskEditorModal.tsx**: Fixed close button (line 281) and Cancel button (line 450) by adding `type="button"` and wrapping onClick handlers with `e.stopPropagation()` to ensure click events propagate correctly.

4. **tests/context-service.test.ts**: Added 3 new tests for `loadSkills` function:
   - `loadSkills loads skill files by ID`
   - `loadSkills returns empty string for empty or null skills`
   - `loadSkills handles nested skill paths`

5. **tests/prompt-builder.test.ts**: Added 2 new tests:
   - `skills are included in the prompt when specified`
   - `skills section is skipped when no skills specified`

### Test Results
- All 204 tests pass
- TypeScript type check passes
- Build compiles successfully

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Skills are now loaded and injected into the XML context, with tests covering the new paths, and the modal close buttons are wired consistently.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Adequate.
- Missing tests: None noted.

### What's Good
- Skill loading mirrors existing context loaders and adds targeted tests for nested paths and prompt inclusion.

### Recommendations
- None.
