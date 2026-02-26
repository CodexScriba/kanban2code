---
stage: completed
agent: auditor
contexts: []
---

# Clean Slate Bootstrap

## Goal
New repo skeleton compiles, extension activates in VS Code, nothing more.

## Definition of Done
- [x] `bun run build` succeeds
- [x] extension loads in Extension Development Host
- [x] Output Channel shows activation message

## Files
- `package.json` - create - strip old commands, old webview contributors; keep core VS Code extension manifest, Bun scripts, esbuild
- `tsconfig.json` - create - copy from /home/cynicus/code/kanban2code-v1/, verify paths
- `build.ts` - create - copy from /home/cynicus/code/kanban2code-v1/, keep and clean board + sidebar bundle references for V2
- `vitest.config.ts` - create - copy from /home/cynicus/code/kanban2code-v1/
- `vitest.e2e.config.ts` - create - copy from /home/cynicus/code/kanban2code-v1/
- `.vscodeignore` - create - copy from /home/cynicus/code/kanban2code-v1/
- `.prettierrc` - create - copy from /home/cynicus/code/kanban2code-v1/
- `eslint.config.mjs` - create - copy from /home/cynicus/code/kanban2code-v1/
- `src/extension.ts` - create - stub only: activate() logs "Kanban2Code V2 activated", deactivate() is empty
- `src/webview/ui/main.tsx` - create - stub: renders <div>Loading...</div>
- `src/webview/ui/vscodeApi.ts` - create - port from /home/cynicus/code/kanban2code-v1/ (src/webview/ui/vscodeApi.ts), singleton pattern must be preserved

## Context
Original files from the previous version are located at `/home/cynicus/code/kanban2code-v1/`.

## Refined Prompt
Objective: Create a minimal VS Code extension skeleton that compiles and activates with a simple activation message.

Implementation approach:
1. Copy `package.json` from v1, strip all commands/contributors except core extension manifest, update version to 2.0.0
2. Copy `tsconfig.json` from v1 - verify paths work for new project root
3. Copy `build.ts` from v1 - simplify to only build extension.ts and webview/main.tsx (remove Monaco assets, agent/context bundling for now)
4. Copy `vitest.config.ts` and `vitest.e2e.config.ts` from v1
5. Copy `.vscodeignore`, `.prettierrc`, `eslint.config.mjs` from v1
6. Create `src/extension.ts` with minimal activate() that logs "Kanban2Code V2 activated" to Output Channel
7. Create `src/webview/ui/main.tsx` that renders `<div>Loading...</div>`
8. Create `src/webview/ui/vscodeApi.ts` - port the singleton pattern from v1 (lines 1-4)
9. Run `bun install` to install dependencies
10. Run `bun run build` to verify compilation
11. Test in Extension Development Host

Key decisions:
- Keep v1 build structure but simplify: no Monaco assets, no agent/context bundling - those are future tasks
- Use Bun as package manager (v1 already uses Bun scripts)
- Stub webview returns minimal HTML - full UI comes in later tasks

Edge cases:
- Bun may not be installed: User must have Bun installed (document in README if needed)
- esbuild may need to be installed globally or via node_modules

Questions (only if blocked):
- None - all source files are available from v1

## Context

### File Tree (scoped)
This is a new project - no existing file tree. Files will be created from v1 copies:

```
package.json                                    # <- create (copy from v1)
tsconfig.json                                  # <- create (copy from v1)
build.ts                                        # <- create (copy from v1, simplify)
vitest.config.ts                               # <- create (copy from v1)
vitest.e2e.config.ts                           # <- create (copy from v1)
.vscodeignore                                   # <- create (copy from v1)
.prettierrc                                     # <- create (copy from v1)
eslint.config.mjs                              # <- create (copy from v1)
src/
├── extension.ts                               # <- create (stub)
└── webview/
    └── ui/
        ├── main.tsx                           # <- create (stub)
        └── vscodeApi.ts                       # <- create (copy from v1)
```

### Architecture Excerpts
No architecture document exists yet - this bootstrap creates the foundation. The extension follows standard VS Code extension patterns:
- Entry point: `src/extension.ts` with activate/deactivate
- Webview: React-based UI served via WebviewView
- Build: esbuild for bundling extension and webview

### Skill Excerpts
No specific skill guidance needed beyond general conventions. This is a bootstrap task that copies existing v1 configurations.

### Code Excerpts

**package.json (v1 lines 1-65)** - Core extension manifest to copy:
```json
{
  "name": "kanban2code",
  "publisher": "cynic",
  "displayName": "Kanban2Code",
  "version": "2.0.0",
  "main": "./dist/extension.js",
  "activationEvents": [
    "workspaceContains:.kanban2code",
    "onView:kanban2code.sidebar"
  ],
  "contributes": {
    "viewsContainers": { "activitybar": [...] },
    "views": { "kanban2code-sidebar": [...] }
  },
  "scripts": {
    "vscode:prepublish": "bun run package",
    "compile": "bun run build.ts",
    "watch": "bun run build.ts --watch",
    "test": "vitest run"
  }
}
```

**src/extension.ts (v1 lines 25-79)** - Reference for activation pattern:
```typescript
export async function activate(context: vscode.ExtensionContext) {
  console.log('Kanban2Code is activating...');
  // ... setup
}

export function deactivate() {
  // ... cleanup
}
```

**src/webview/ui/vscodeApi.ts (v1 lines 1-4)** - Singleton pattern to preserve:
```typescript
declare const acquireVsCodeApi: (() => { postMessage: (message: unknown) => void }) | undefined;
export const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;
```

**build.ts (v1 lines 127-146)** - esbuild args to simplify:
```typescript
const extensionArgs = [
  'src/extension.ts',
  '--bundle', '--platform=node', '--format=cjs',
  '--external:vscode',
  '--outfile=dist/extension.js',
  ...commonArgs,
];

const webviewArgs = [
  'src/webview/ui/main.tsx',
  '--bundle', '--platform=browser', '--format=iife',
  '--outfile=dist/webview.js',
  ...commonArgs,
];
```

### Dependency Graph
New project - no existing dependencies. The task creates these files:
- `package.json` defines the extension manifest
- `build.ts` bundles `src/extension.ts` and `src/webview/ui/main.tsx`
- All other files are configuration

### Patterns to Follow
- Use Bun for package management (already in v1 scripts)
- Use esbuild for bundling (v1 pattern)
- Use vitest for testing (v1 pattern)
- Keep activation simple: log to console, create output channel

### Test Patterns
Tests will use vitest with VS Code stub (`tests/vscode-stub.ts` + `tests/setup.ts` from v1). The bootstrap doesn't create tests yet.

### Gotchas
- Ensure `bun` is installed before running build
- The extension requires a `.kanban2code` folder or sidebar view to activate
- Webview needs a root HTML element (the stub uses `<div>Loading...</div>`)

### Scope Boundaries
This is task 0.1 - the first task in the roadmap. It should NOT:
- Implement any functional code beyond stubs
- Create any services or types from v1 (those are task 1.1+)
- Set up the full webview UI (that comes in task 9.1)
- Implement any commands (task 10.1)
- Create tests beyond the infrastructure

This task is purely about creating a compilable skeleton.

## Audit
/home/cynicus/code/kanban2code/build.ts
/home/cynicus/code/kanban2code/vitest.config.ts
/home/cynicus/code/kanban2code/src/extension.ts
/home/cynicus/code/kanban2code/.kanban2code/projects/roadmap/task0.1-clean-slate-bootstrap.md

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
The bootstrap task now meets the DoD: build succeeds, activation wiring is minimal and correct, and the Output Channel message is explicitly surfaced. The implementation is appropriately scoped for a clean-slate baseline.

### Findings

#### Blockers
- None.

#### High Priority
- None.

#### Medium Priority
- None.

#### Low Priority / Nits
- None.

### Test Assessment
- Coverage: Needs improvement (expected for bootstrap stage)
- Missing tests: Optional activation smoke test and output-channel assertion test for regression protection

### What's Good
- `bun run build` passes and produces both extension and webview bundles.
- `activate()` creates/subscribes an Output Channel, appends the activation line, and calls `show(true)` to satisfy visibility requirements.
- Build script is portable and cleanly bundles only the intended bootstrap entry points.

### Recommendations
- Add a minimal Vitest smoke test for activation behavior once the first test scaffold task lands.
