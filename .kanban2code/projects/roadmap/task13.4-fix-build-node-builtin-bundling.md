---
stage: completed
agent: auditor
tags: [bug, p1]
contexts: []
---

# Fix Build Node Builtin Bundling

## Goal
Make `bun run build` pass by resolving Node builtin module bundling errors in the webview pipeline.

## Problem
Current build allows Node-only modules to enter webview bundle graph. The webview code imports types from service files that contain Node.js runtime code:
- `ProviderConfigFile` imported from `src/services/provider-service.ts` (uses `fs/promises`, `path`)
- `Agent`, `ContextFile`, `SkillFile` imported from `src/services/context.ts` (uses `fs/promises`, `path`)

These imports create a dependency chain that can pull `fs/promises` and `path` into the browser-targeted webview bundle.

## Scope
- Move pure type definitions from service files to `src/types/`
- Update imports in `messaging.ts` to use types from `src/types/`
- Update imports in `snapshot.ts` to use types from `src/types/`
- Ensure service files re-export types for backward compatibility
- Update build configuration only if needed for correct targets

## Definition of Done
- [x] `bun run build` exits successfully
- [x] No Node builtin resolution errors in webview bundle
- [x] Existing tests remain green

## Notes
Created from dogfooding findings in task13.1.

## Refined Prompt

Objective: Fix extension/webview boundary violations by moving pure type definitions out of Node.js service files and into shared types.

Implementation approach:
1. Create new `src/types/workspace-entities.ts` file for shared entity types
2. Move `ProviderConfigFile` interface from `src/services/provider-service.ts` to `src/types/workspace-entities.ts`
3. Move `Agent`, `ContextFile`, `SkillFile` interfaces from `src/services/context.ts` to `src/types/workspace-entities.ts`
4. Update `src/services/provider-service.ts` to import and re-export `ProviderConfigFile` from types
5. Update `src/services/context.ts` to import and re-export `Agent`, `ContextFile`, `SkillFile` from types
6. Update `src/types/snapshot.ts` to import `Agent`, `ContextFile`, `SkillFile`, `ProviderConfigFile` from `workspace-entities.ts` instead of service files
7. Update `src/webview/messaging.ts` to import types from `src/types/workspace-entities.ts` instead of service files
8. Update `src/webview/ui/App.tsx` to import `ProviderConfigFile` from `src/types/workspace-entities.ts`
9. Run `bun run build` to verify no Node builtin bundling issues
10. Run `bun run test` to ensure no regressions

Key decisions:
- New file location: `src/types/workspace-entities.ts` for entity types that cross extension/webview boundary
- Backward compatibility: Service files re-export types so existing imports don't break
- Webview boundary: Webview code should only import types from `src/types/`, never from `src/services/`

Edge cases:
- Circular imports: Ensure new types file doesn't import from services
- Schema validation: `z.custom<T>()` in messaging.ts uses these types - no runtime change needed
- Type re-exports: Service functions return these types; re-exports maintain API compatibility

## Context

### File Tree (scoped)
```
src/
├── types/
│   ├── snapshot.ts              <- modify (update imports)
│   ├── task.ts                  <- read-only reference
│   └── workspace-entities.ts    <- create
├── services/
│   ├── context.ts               <- modify (move types, re-export)
│   └── provider-service.ts      <- modify (move type, re-export)
├── webview/
│   ├── messaging.ts             <- modify (update imports)
│   └── ui/
│       └── App.tsx              <- modify (update ProviderConfigFile import)
```

### Architecture Excerpts

From docs/architecture.md:
- `build.ts`: Esbuild-based bundling pipeline for both extension and webview targets
- Extension bundle: `dist/extension.js` with `--platform=node`
- Webview bundle: `dist/webview.js` with `--platform=browser`

Boundary convention:
- Webview code (`src/webview/`) runs in browser context - no Node.js APIs
- Service code (`src/services/`) runs in extension host - has Node.js APIs
- Types (`src/types/`) are pure TypeScript - safe for both contexts

### Code Excerpts

`src/services/provider-service.ts:1-13` - Current ProviderConfigFile location:
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
// ... other imports

export interface ProviderConfigFile {
  id: string;
  name: string;
  path: string;
  config?: ProviderConfig;
}
```
Why: This interface is pure data but lives in a file with Node.js imports.

`src/services/context.ts:1-35` - Current Agent/ContextFile/SkillFile location:
```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
// ... other imports

export interface ContextFile {
  id: string;
  name: string;
  description: string;
  path: string;
  scope?: 'global' | 'project';
}

export interface SkillFile {
  id: string;
  name: string;
  description: string;
  path: string;
  framework?: string;
  priority?: 'high' | 'medium' | 'low';
  alwaysAttach?: boolean;
  triggers?: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  path: string;
}
```
Why: These pure data interfaces are in a file with fs/path imports.

`src/types/snapshot.ts:1-5` - Imports from service files:
```typescript
import type { Kanban2CodeConfig } from './config';
import type { Agent, ContextFile, SkillFile } from '../services/context';
import type { ProviderConfigFile } from '../services/provider-service';
```
Why: Types file importing from services creates webview bundle contamination risk.

`src/webview/messaging.ts:1-7` - Webview imports from services:
```typescript
import { z } from 'zod';
import type { Agent, ContextFile, SkillFile } from '../services/context';
import type { ProviderConfigFile } from '../services/provider-service';
```
Why: Webview code should not import from service files containing Node.js code.

`src/webview/ui/App.tsx:1-5` - Webview component import:
```typescript
import React, { useEffect, useMemo, useState } from 'react';
import type { ProviderConfigFile } from '../../services/provider-service';
```
Why: Component importing from service file pulls in Node.js dependencies.

### Dependency Graph

Files importing types from `src/services/context.ts`:
- `src/types/snapshot.ts` - imports `Agent`, `ContextFile`, `SkillFile`
- `src/webview/messaging.ts` - imports `Agent`, `ContextFile`, `SkillFile`

Files importing types from `src/services/provider-service.ts`:
- `src/types/snapshot.ts` - imports `ProviderConfigFile`
- `src/webview/messaging.ts` - imports `ProviderConfigFile`
- `src/webview/ui/App.tsx` - imports `ProviderConfigFile`
- `src/webview/ui/components/Chat.tsx` - imports `ProviderConfigFile`
- `src/webview/ui/components/ChatInput.tsx` - imports `ProviderConfigFile`

### Patterns to Follow

- Keep pure type definitions in `src/types/` directory
- Service files should import types from `src/types/` and re-export for convenience
- Webview code should only import from `src/types/`, never from `src/services/`
- Use `export type { ... }` for type-only re-exports to avoid runtime dependencies

### Test Patterns

Build verification:
- `bun run build` should complete without Node builtin warnings for webview bundle
- Tests in `tests/` directory validate runtime behavior unchanged

### Gotchas

- z.custom<T>() usage: These are type-only markers, no runtime validation change needed
- Re-export pattern: `export type { X } from '../types/file'` is safe for webview
- Import path updates: Webview files need import path changes from `../../services/` to `../../types/`

### Scope Boundaries

- Do NOT modify build.ts configuration (task13.4 is about fixing imports, not build config)
- Do NOT change runtime behavior - this is a code organization refactor
- Do NOT modify test files unless import paths need updating
- Do NOT add new functionality - only move existing type definitions
- Type fixes in webview messaging are handled in task13.3 (completed)

<!-- STAGE_TRANSITION: audit -->

## Audit
src/types/workspace-entities.ts
src/services/provider-service.ts
src/services/context.ts
src/types/snapshot.ts
src/webview/messaging.ts
src/webview/ui/App.tsx
src/webview/ui/components/Chat.tsx
src/webview/ui/components/ChatInput.tsx
src/assets/contexts.ts
dist/extension.js
dist/extension.js.map
dist/webview.js
dist/webview.js.map
.kanban2code/projects/roadmap/task13.4-fix-build-node-builtin-bundling.md

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
The implementation cleanly removes Node-bound service type imports from browser-targeted webview code and preserves compatibility via type re-exports in service modules. Build and full test suite both pass, and no Node builtin resolution errors remain in webview bundling.

### Findings

#### Blockers
- [x] None.

#### High Priority
- [x] None.

#### Medium Priority
- [x] None.

#### Low Priority / Nits
- [ ] Consider adding a guard (lint rule or test assertion) that prevents future `src/webview/ui/**` imports from `src/services/**` to avoid boundary regressions.

### Test Assessment
- Coverage: Adequate
- Missing tests:
  - Optional import-boundary regression guard for webview/service separation

### What's Good
- Shared entity types were correctly centralized in `src/types/workspace-entities.ts`, and all relevant webview/snapshot imports were updated to type-safe shared paths.
- Backward compatibility was maintained by re-exporting moved types from `src/services/context.ts` and `src/services/provider-service.ts`.
- Validation evidence:
  - `bun run build` passed with no Node builtin bundling errors
  - `bun run test` passed (`37` files, `282` tests)

### Recommendations
- Add a lightweight static check to enforce extension/webview boundary import rules over time.
