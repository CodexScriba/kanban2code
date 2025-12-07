# Kanban2Code Architecture Map

Overview of the current project layout, focusing on the Phase 0 bootstrap: Bun tooling, VS Code extension skeleton, workspace scaffolding, and webview shell. The tree uses an XML-style structure for easy machine parsing.

```xml
<project name="kanban2code">
  <file name="package.json" role="Extension manifest: commands/views, Bun scripts, deps" />
  <file name="bun.lock" role="Locked dependency graph for Bun" />
  <file name="tsconfig.json" role="TypeScript config targeting VS Code extension + webview" />
  <file name=".eslintrc.cjs" role="ESLint config with TypeScript + Prettier" />
  <file name="prettier.config.cjs" role="Prettier formatting rules" />
  <file name=".gitignore" role="Ignore build artifacts, caches, .vscode-test" />
  <file name="README.md" role="Developer quickstart (Bun build, commands)" />
  <dir name="docs" role="Project documentation">
    <file name="architecture.md" role="This architecture map" />
  </dir>
  <dir name="scripts" role="Build tooling">
    <file name="build.ts" role="esbuild bundler for extension (node) and webview (browser)" />
  </dir>
  <dir name="src" role="Extension source">
    <file name="extension.ts" role="Activate extension; register commands + sidebar" />
    <dir name="commands" role="VS Code commands">
      <file name="openBoard.ts" role="Open board webview; scaffold if missing" />
      <file name="newTask.ts" role="Create inbox task Markdown and open editor" />
      <file name="scaffoldWorkspace.ts" role="Run workspace scaffolder" />
    </dir>
    <dir name="workspace" role="Workspace detection + scaffolding">
      <file name="validation.ts" role="Find .kanban2code root; guard paths; pick default folder" />
      <file name="scaffolder.ts" role="Create canonical .kanban2code tree, templates, sample task" />
    </dir>
    <dir name="core" role="Shared constants">
      <file name="constants.ts" role="Stage list and folder names" />
    </dir>
    <dir name="types" role="Shared types">
      <file name="task.ts" role="Task + Stage typings" />
    </dir>
    <dir name="webview" role="Webview UI shell">
      <file name="BoardPanel.ts" role="Panel host with CSP + messaging (refresh/scaffold)" />
      <file name="SidebarProvider.ts" role="Sidebar view (detect root, scaffold/open actions)" />
      <file name="App.tsx" role="React UI scaffold for board columns and actions" />
      <file name="main.tsx" role="Webview entry; boot React root" />
    </dir>
  </dir>
  <dir name="media" role="Extension assets">
    <file name="icon.svg" role="Activity bar icon" />
  </dir>
  <dir name="dist" role="Build output (generated)">
    <file name="extension.js" role="Bundled extension" />
    <file name="webview.js" role="Bundled webview" />
  </dir>
  <dir name="webview" role="Placeholder for web assets">
    <file name=".gitkeep" role="Keeps directory in VCS" />
  </dir>
  <dir name="tests" role="(reserved for future tests)" />
  <dir name="kanban2code_roadmap" role="Roadmap markdown tasks by phase">
    <file name="roadmap_new.md" role="Project roadmap overview" />
    <dir name="phase-0-foundation" role="Phase 0 task cards" />
    <dir name="phase-1-filesystem-and-tasks" role="Phase 1 task cards" />
    <dir name="phase-2-context-system" role="Phase 2 task cards" />
    <dir name="phase-3-sidebar-ui" role="Phase 3 task cards" />
    <dir name="phase-4-board-webview" role="Phase 4 task cards" />
    <dir name="phase-5-polish-and-docs" role="Phase 5 task cards" />
  </dir>
  <dir name="node_modules" role="Dependencies (generated)" />
</project>
```

Notes:
- Build with `bun run build`; outputs land in `dist/`.
- Webview CSP is locked down; scripts are bundled via esbuild.
- Workspace scaffolding creates `.kanban2code/` at runtime with inbox/projects/templates/agents/archive and a sample task.
