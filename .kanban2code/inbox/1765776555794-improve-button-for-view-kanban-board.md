---
stage: completed
tags: []
contexts:
  - architecture
  - ai-guide
agent: code-reviewer
---
# improve button for view kanban board

The view kanban button is too small, make a view kanban button more prominent and easier to find.

<context-pack timestamp="2025-12-16T00:07:00.000Z" task="improve button for view kanban board">
  <meta>
    <scope>ui-improvement</scope>
    <stack>
      <language>TypeScript</language>
      <framework>React</framework>
      <build-tools>
        <tool>esbuild</tool>
        <tool>bun</tool>
      </build-tools>
      <test-tools>
        <tool>vitest</tool>
      </test-tools>
    </stack>
  </meta>

  <architecture>
    <primary-source path="docs/architecture.md" />
    <key-points>
      <item>Kanban2Code is a VS Code extension with a sidebar UI and board webview</item>
      <item>UI components are in src/webview/ui/components/ with React</item>
      <item>Styles are in src/webview/ui/styles/main.css with Navy Night Gradient theme</item>
      <item>Sidebar contains a toolbar with action buttons including the board view button</item>
    </key-points>
    <extracts>
      <extract source="src/webview/ui/components/SidebarToolbar.tsx:16-23">
        <![CDATA[
<div className="toolbar-actions">
  <button
    className="btn btn-icon btn-ghost tooltip"
    data-tooltip="Open Board"
    onClick={onOpenBoard}
  >
    <BoardIcon />
  </button>
]]>
      </extract>
      <extract source="src/webview/ui/styles/main.css:575-580">
        <![CDATA[
.btn-icon {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--radius-sm);
}
]]>
      </extract>
    </extracts>
  </architecture>

  <database>
    <status>not-detected</status>
    <engine>unknown</engine>
    <schema-sources>
    </schema-sources>
    <model>
    </model>
    <access-layer>
      <pattern>none</pattern>
      <locations>
      </locations>
      <error-handling>none</error-handling>
      <transactions>none</transactions>
    </access-layer>
  </database>

  <code-map>
    <files>
      <file path="src/webview/ui/components/SidebarToolbar.tsx" role="modify">
        <reason>Contains the board view button that needs to be made more prominent</reason>
        <extract source="src/webview/ui/components/SidebarToolbar.tsx:1-34">
          <![CDATA[
import React from 'react';
import { SettingsIcon, BoardIcon } from './Icons';

interface SidebarToolbarProps {
  onOpenBoard: () => void;
  onOpenSettings: () => void;
}

export const SidebarToolbar: React.FC<SidebarToolbarProps> = ({
  onOpenBoard,
  onOpenSettings,
}) => {
  return (
    <div className="sidebar-toolbar">
      <span className="sidebar-title">Kanban2Code</span>
      <div className="toolbar-actions">
        <button
          className="btn btn-icon btn-ghost tooltip"
          data-tooltip="Open Board"
          onClick={onOpenBoard}
        >
          <BoardIcon />
        </button>
        <button
          className="btn btn-icon btn-ghost tooltip"
          data-tooltip="Settings"
          onClick={onOpenSettings}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
]]>
        </extract>
      </file>
      <file path="src/webview/ui/components/Icons.tsx" role="reference">
        <reason>Contains the BoardIcon component used in the toolbar</reason>
        <extract source="src/webview/ui/components/Icons.tsx:16-21">
          <![CDATA[
export const BoardIcon: React.FC<IconProps> = ({ className = 'icon', style }) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
    <path d="M5 0v16M10 0v16"/>
  </svg>
);
]]>
        </extract>
      </file>
      <file path="src/webview/ui/styles/main.css" role="modify">
        <reason>Contains the CSS styles for the button that needs to be made larger</reason>
        <extract source="src/webview/ui/styles/main.css:575-580">
          <![CDATA[
.btn-icon {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--radius-sm);
}
]]>
        </extract>
      </file>
    </files>
    <types>
      <type name="SidebarToolbarProps" source="src/webview/ui/components/SidebarToolbar.tsx:4-7">
        <![CDATA[
interface SidebarToolbarProps {
  onOpenBoard: () => void;
  onOpenSettings: () => void;
}
]]>
      </type>
      <type name="IconProps" source="src/webview/ui/components/Icons.tsx:3-7">
        <![CDATA[
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}
]]>
      </type>
    </types>
    <functions>
      <function name="SidebarToolbar" source="src/webview/ui/components/SidebarToolbar.tsx:9-34">
        <signature>const SidebarToolbar: React.FC<SidebarToolbarProps></signature>
        <purpose> Renders the sidebar toolbar with title and action buttons</purpose>
        <callers>
        </callers>
      </function>
      <function name="BoardIcon" source="src/webview/ui/components/Icons.tsx:16-21">
        <signature>const BoardIcon: React.FC<IconProps></signature>
        <purpose> Renders the board icon SVG</purpose>
        <callers>
          <caller source="src/webview/ui/components/SidebarToolbar.tsx:22" />
        </callers>
      </function>
    </functions>
    <data-flow>The board view button is in the sidebar toolbar, which calls onOpenBoard when clicked. The button currently uses the btn-icon class which makes it 28x28px.</data-flow>
  </code-map>

  <tests>
    <framework>vitest</framework>
    <how-to-run>
      <command>bun run test</command>
    </how-to-run>
    <existing-tests>
    </existing-tests>
    <required-coverage>
      <item>Test that the board button is larger and more prominent</item>
      <item>Test that the button still functions correctly after size changes</item>
    </required-coverage>
  </tests>

  <constraints>
    <validation>
      <item>Button must remain functional and accessible</item>
      <item>Changes should be consistent with the Navy Night Gradient theme</item>
      <item>Button should not break the toolbar layout</item>
    </validation>
    <naming>
      <item>Use existing CSS class naming conventions</item>
      <item>Follow React component patterns</item>
    </naming>
    <security>
      <item>Never output secrets; redact config values.</item>
    </security>
  </constraints>

  <open-questions>
    <uncertainty>Should the button be made larger through CSS class changes or by adding a new class specifically for the board button? Should the icon size also be increased?</uncertainty>
  </open-questions>

  <handoff>
    <planning-agent-ready>true</planning-agent-ready>
    <coding-agent-ready>true</coding-agent-ready>
    <next-step>Modify the board button in SidebarToolbar.tsx to make it more prominent, either by increasing its size through CSS or by adding a label to make it more discoverable. Consider creating a new CSS class for this purpose.</next-step>
  </handoff>
</context-pack>

##Audit
- src/webview/ui/components/SidebarToolbar.tsx
- src/webview/ui/styles/main.css
- tests/webview/components/SidebarToolbar.test.tsx
- .kanban2code/inbox/1765776555794-improve-button-for-view-kanban-board.md
