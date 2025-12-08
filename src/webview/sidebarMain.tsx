import React from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './Sidebar';

// VS Code exposes this to the webview runtime.
declare const acquireVsCodeApi: <T>() => {
  postMessage: (message: T) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
};

const vscode = acquireVsCodeApi();
const container = document.getElementById('root');
const kanbanRoot = container?.getAttribute('data-kanban-root') || null;

if (container) {
  const root = createRoot(container);
  root.render(<Sidebar kanbanRoot={kanbanRoot} vscode={vscode} />);
}
