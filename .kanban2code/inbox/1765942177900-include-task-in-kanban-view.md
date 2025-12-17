---
stage: audit
tags: []
contexts:
  - architecture
agent: code-reviewer
---

# include task # in kanban view

I cannot see the task.# in the kanban, i can only see the name. which makes the sequence complex because they get disorganized, I need to fix this.

<context-pack timestamp="2025-12-16T23:30:00Z" task="Display task number prefix in Kanban view for roadmap tasks">
  <meta>
    <scope>UI display of task titles in Kanban board and sidebar</scope>
    <stack>
      <language>TypeScript</language>
      <framework>React + VS Code Extension</framework>
      <build-tools><tool>esbuild</tool><tool>bun</tool></build-tools>
      <test-tools><tool>vitest</tool><tool>@testing-library/react</tool></test-tools>
    </stack>
  </meta>

  <task>
    <original><![CDATA[I cannot see the task.# in the kanban, i can only see the name. which makes the sequence complex because they get disorganized, I need to fix this.]]></original>
    <clarifying-questions>
      <question>Should timestamps be shown for inbox tasks?</question>
      <question>What display format for task numbers: prefix, badge, or minimal?</question>
    </clarifying-questions>
    <assumptions>
      <item>Only roadmap tasks with taskX.Y pattern should show the number prefix</item>
      <item>Inbox tasks with timestamp IDs should NOT show the timestamp - just title</item>
      <item>Minimal format preferred: "1.2 Remove Template Service"</item>
    </assumptions>
    <refined-prompt><![CDATA[
Objective: Display task number prefix in Kanban views for roadmap/phase tasks only.

Context: Task files in phases use naming like `task1.2-remove-template-service.md`. The task `id` contains this info but `title` is extracted from the markdown `# heading` which doesn't include the number. Inbox tasks have timestamp-based IDs that should NOT be displayed.

Acceptance criteria:
- Roadmap tasks (matching pattern `taskX.Y-*`) display as "1.2 Remove Template Service" (minimal prefix)
- Inbox tasks with timestamp IDs display title only (no timestamp shown)
- Both TaskCard (board view) and TaskItem (sidebar tree) components updated
- Existing tests updated to verify new display logic

Non-goals:
- Do not change how task IDs are generated or stored
- Do not modify the Task type definition
- Do not change the markdown heading extraction logic

Notes/constraints:
- Create a utility function to extract display title from task id + title
- Pattern to detect roadmap tasks: /^task\d+\.\d+-/
- Pattern to extract task number: capture group from /^task(\d+\.\d+)-/
    ]]></refined-prompt>
  </task>

  <architecture>
    <primary-source path="docs/architecture.md" />
    <key-points>
      <item>Task title extracted from markdown # heading in frontmatter.ts:extractTitle()</item>
      <item>Task id is path.basename(filePath, '.md') - contains full filename without extension</item>
      <item>TaskCard.tsx renders board cards, TaskItem.tsx renders sidebar tree items</item>
      <item>Both components receive Task object and display task.title directly</item>
    </key-points>
  </architecture>

  <database>
    <status>not-detected</status>
    <engine>filesystem</engine>
    <schema-sources>
      <source path="src/types/task.ts" kind="inferred" />
    </schema-sources>
    <model>
      <entity name="Task">
        <fields>
          <field name="id" type="string" />
          <field name="filePath" type="string" />
          <field name="title" type="string" />
          <field name="stage" type="Stage" />
          <field name="project" type="string?" />
          <field name="phase" type="string?" />
        </fields>
      </entity>
    </model>
  </database>

  <code-map>
    <files>
      <file path="src/webview/ui/components/TaskCard.tsx" role="modify">
        <reason>Board view card - displays task.title in card header</reason>
        <extract source="src/webview/ui/components/TaskCard.tsx:74">
          <![CDATA[
<span className={`card-title ${isCompleted ? 'completed' : ''}`}>{task.title}</span>
          ]]>
        </extract>
      </file>
      <file path="src/webview/ui/components/TaskItem.tsx" role="modify">
        <reason>Sidebar tree item - displays task.title</reason>
        <extract source="src/webview/ui/components/TaskItem.tsx:62">
          <![CDATA[
<div className="task-title">{task.title}</div>
          ]]>
        </extract>
      </file>
      <file path="src/utils/text.ts" role="modify">
        <reason>Add utility function for extracting display title with task number prefix</reason>
        <extract source="src/utils/text.ts:1-9">
          <![CDATA[
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
          ]]>
        </extract>
      </file>
      <file path="src/services/frontmatter.ts" role="reference">
        <reason>Shows how title and id are derived from file</reason>
        <extract source="src/services/frontmatter.ts:54-56">
          <![CDATA[
const task: Task = {
  id: path.basename(filePath, '.md'),
  title: extractTitle(body) || path.basename(filePath, '.md'),
          ]]>
        </extract>
      </file>
    </files>
    <types>
      <type name="Task" source="src/types/task.ts:3-17">
        <![CDATA[
export interface Task {
  id: string;
  filePath: string;
  title: string;
  stage: Stage;
  project?: string;
  phase?: string;
  agent?: string;
  parent?: string;
  tags?: string[];
  contexts?: string[];
  order?: number;
  created?: string;
  content: string;
}
        ]]>
      </type>
    </types>
    <functions>
      <function name="getDisplayTitle" source="src/utils/text.ts:NEW">
        <signature><![CDATA[(task: { id: string; title: string }) => string]]></signature>
        <purpose>Extract display title: prepend task number for roadmap tasks, title-only for inbox</purpose>
        <callers>
          <caller source="src/webview/ui/components/TaskCard.tsx" />
          <caller source="src/webview/ui/components/TaskItem.tsx" />
        </callers>
      </function>
    </functions>
    <data-flow>Task loaded from file -> id from filename, title from # heading -> TaskCard/TaskItem render task.title -> NEW: getDisplayTitle(task) returns formatted title</data-flow>
  </code-map>

  <tests>
    <framework>vitest</framework>
    <how-to-run>
      <command>bun run test</command>
      <command>bun run test tests/webview/taskcard.test.tsx</command>
      <command>bun run test tests/utils.test.ts</command>
    </how-to-run>
    <existing-tests>
      <test-file path="tests/webview/taskcard.test.tsx">
        <patterns>
          <item>Uses @testing-library/react render/screen/fireEvent</item>
          <item>Dynamic imports for components</item>
          <item>Mock acquireVsCodeApi in beforeAll</item>
          <item>Test verifies title display: expect(screen.getByText('My Test Task')).toBeInTheDocument()</item>
        </patterns>
      </test-file>
      <test-file path="tests/utils.test.ts">
        <patterns>
          <item>Tests for slugify utility function</item>
        </patterns>
      </test-file>
    </existing-tests>
    <required-coverage>
      <item>getDisplayTitle returns "1.2 Title" for task with id "task1.2-some-name"</item>
      <item>getDisplayTitle returns "Title" only for task with timestamp id "1765942177900-some-name"</item>
      <item>getDisplayTitle handles edge cases: no match, empty title</item>
      <item>TaskCard displays formatted title for roadmap task</item>
      <item>TaskItem displays formatted title for roadmap task</item>
    </required-coverage>
  </tests>

  <constraints>
    <validation>
      <item>Regex pattern for roadmap task: /^task(\d+(?:\.\d+)?)-/</item>
      <item>Regex pattern for timestamp: /^\d{13}-/ (13-digit epoch)</item>
    </validation>
    <naming>
      <item>Utility function: getDisplayTitle in src/utils/text.ts</item>
      <item>Keep existing slugify function unchanged</item>
    </naming>
    <security>
      <item>No secrets involved in this change</item>
    </security>
  </constraints>

  <open-questions>
    <uncertainty>None - requirements clarified through user interaction</uncertainty>
  </open-questions>

  <handoff>
    <planning-agent-ready>true</planning-agent-ready>
    <coding-agent-ready>true</coding-agent-ready>
    <next-step>Implement getDisplayTitle utility function in src/utils/text.ts, then update TaskCard.tsx and TaskItem.tsx to use it, finally add/update tests</next-step>
  </handoff>
</context-pack> 

## Audit
src/utils/text.ts
src/webview/ui/components/TaskCard.tsx
src/webview/ui/components/TaskItem.tsx
tests/utils.test.ts
tests/webview/taskcard.test.tsx
tests/webview/taskitem.test.tsx
.kanban2code/inbox/1765942177900-include-task-in-kanban-view.md
