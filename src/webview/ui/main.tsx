import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { vscode } from './vscodeApi';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App vscode={vscode} />);
}
