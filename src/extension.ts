import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel('Kanban2Code');
  context.subscriptions.push(output);

  output.appendLine('Kanban2Code V2 activated');
  output.show(true);
  console.log('Kanban2Code V2 activated');
}

export function deactivate() {}
