---
stage: completed
tags: [feature, context-done, skills-done]
contexts: []
agent: context-agent
---

# Add naming conventions

decide best naming conventions for react and python and decide if python should be getting skilsl as well 

<context-pack timestamp="2025-12-18T16:03:00-06:00" task="Establish naming conventions for React and Python">
  <meta>
    <scope>global</scope>
    <stack>
      <language>TypeScript, JavaScript</language>
      <framework>React, Bun, VS Code Extension API</framework>
      <build-tools><tool>bun</tool><tool>esbuild</tool></build-tools>
      <test-tools><tool>vitest</tool></test-tools>
    </stack>
  </meta>

  <skills>
    <index-version>16.0.10</index-version>
    <core>
      <skill path="_context/skills/nextjs-core-skills.md" reason="always_attach for Next.js framework (present in skills-index.json)">
        <description>Mandatory baseline for Next.js 16. Covers async APIs (params, cookies, headers), proxy.ts migration, React 19 patterns (useActionState), and parallel route requirements.</description>
      </skill>
    </core>
    <conditional />
    <skipped>
      <skill name="Caching &amp; Data Fetching" reason="no trigger match" />
      <skill name="Server Actions &amp; Mutations" reason="no trigger match" />
      <skill name="Routing &amp; Layouts" reason="no trigger match" />
      <skill name="Metadata &amp; SEO" reason="no trigger match" />
      <skill name="TypeScript &amp; Config" reason="no trigger match" />
    </skipped>
  </skills>

  <task>
    <original><![CDATA[decide best naming conventions for react and python and decide if python should be getting skilsl as well]]></original>
    <clarifying-questions>
      <question>Is Python intended for new AI agents, or for a new backend service?</question>
      <question>Should the naming conventions be added to architecture.md or a new _context/conventions.md file?</question>
      <question>Are there specific Python frameworks being considered (e.g., FastAPI, Flask)?</question>
    </clarifying-questions>
    <assumptions>
      <item>Python is being introduced for future extensibility or new toolsets.</item>
      <item>Conventions should be documented in a central, agent-accessible location.</item>
    </assumptions>
    <refined-prompt><![CDATA[
Objective: Establish formal naming conventions for React (TypeScript) and Python, and evaluate the need for Python "skills" documentation.

Context: 
- The project is a TypeScript-based VS Code extension using React for UIs.
- Current React patterns use PascalCase for components, camelCase for props/hooks, and kebab-case for CSS classes.
- No Python code currently exists in the repo, but conventions are needed for future consistency.
- A "skills" system exists for Next.js 16 (guardrails) but could be extended to Python.

Acceptance criteria:
- Documented React/TS naming conventions (Components, Hooks, Types, CSS).
- Documented Python naming conventions (PEP 8 alignment, type hints, docstrings).
- Decision on whether to create Python-specific skill files in .kanban2code/_context/skills/.
- If yes, list proposed skill files for Python.

Notes/constraints:
- Align with existing TS/React patterns already present in src/webview/ui/.
- Python coding standards should prioritize modern best practices (Type hints, PEP 8).
    ]]></refined-prompt>
  </task>

  <architecture>
    <primary-source path="docs/architecture.md" />
    <key-points>
      <item>Filesystem-based task management using markdown files with frontmatter.</item>
      <item>VS Code extension with React-based webviews (Sidebar and Board).</item>
      <item>Agent-driven orchestration pipeline (Roadmapper, Architect, Splitter, Planner, Coder, Auditor).</item>
    </key-points>
    <extracts>
      <extract source="docs/architecture.md:21">
        <![CDATA[
The technology stack uses Bun as the runtime and package manager, TypeScript for type safety, React for webviews, and Vitest for testing.
        ]]>
      </extract>
    </extracts>
  </architecture>

  <database>
    <status>detected</status>
    <engine>filesystem</engine>
    <schema-sources>
      <source path=".kanban2code/" kind="inferred" />
    </schema-sources>
    <model>
      <entity name="Task">
        <fields>
          <field name="id" type="string (filename)" />
          <field name="stage" type="enum (inbox|plan|code|audit|completed)" />
          <field name="tags" type="string[]" />
          <field name="agent" type="string" />
          <field name="contexts" type="string[]" />
          <field name="parent" type="string (id)" />
        </fields>
        <relationships>
          <relationship type="fk" to="Task" detail="parent field links to parent task ID" />
        </relationships>
      </entity>
    </model>
    <access-layer>
      <pattern>Custom services (scanner, task-content, frontmatter) using Node/Bun fs APIs</pattern>
      <locations>
        <location path="src/services/scanner.ts:1" />
        <location path="src/services/task-content.ts:1" />
      </locations>
      <error-handling>Typed exceptions (FileSystemError, TaskValidationError) with recovery hints.</error-handling>
    </access-layer>
  </database>

  <code-map>
    <files>
      <file path="src/webview/ui/components/Sidebar.tsx" role="reference">
        <reason>Example of current React component and hook naming patterns.</reason>
      </file>
      <file path="src/types/filters.ts" role="reference">
        <reason>Defines existing tag taxonomy and naming conventions for task metadata.</reason>
      </file>
      <file path=".kanban2code/_agents/react-dev.md" role="reference">
        <reason>Existing React-focused agent instructions.</reason>
      </file>
    </files>
  </code-map>

  <tests>
    <framework>vitest</framework>
    <how-to-run>
      <command>bun run test</command>
    </how-to-run>
    <existing-tests>
      <test-file path="tests/tag-taxonomy.test.ts">
        <patterns>
          <item>Unit tests for convention validation logic.</item>
        </patterns>
      </test-file>
    </existing-tests>
    <required-coverage>
      <item>70% statements/lines/functions, 65% branches (enforced).</item>
    </required-coverage>
  </tests>

  <constraints>
    <validation>
      <item>Strict TypeScript type safety.</item>
      <item>Functional React components with hooks.</item>
    </validation>
    <naming>
      <item>React: PascalCase for components, camelCase for props/hooks.</item>
      <item>CSS: kebab-case for classes.</item>
    </naming>
    <security>
      <item>Never output secrets; redact config values.</item>
    </security>
  </constraints>

  <handoff>
    <planning-agent-ready>true</planning-agent-ready>
    <coding-agent-ready>true</coding-agent-ready>
    <next-step>Propose a set of naming convention rules for both languages and suggest 2-3 Python skill files to create.</next-step>
  </handoff>
</context-pack>
