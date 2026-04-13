import * as vscode from 'vscode';
import { WebviewMessage } from './webviews/lib/messages';

class HomeViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'kanban2code.homeView';

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist')],
    };

    webviewView.webview.html = this.buildHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message: WebviewMessage) => {
      switch (message.command) {
        case 'createKanban':
          vscode.window.showInformationMessage('Create Kanban — coming soon');
          break;
        case 'openSidebar':
          vscode.window.showInformationMessage('Open Sidebar — coming soon');
          break;
        case 'openChat':
          vscode.window.showInformationMessage('Open Chat — coming soon');
          break;
        case 'connectOpenClaw':
          vscode.window.showInformationMessage('Connect OpenClaw — coming soon');
          break;
      }
    });
  }

  private buildHtml(webview: vscode.Webview): string {
    const styles = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webviews', 'styles');
    const tokensUri     = webview.asWebviewUri(vscode.Uri.joinPath(styles, 'tokens.css'));
    const baseUri       = webview.asWebviewUri(vscode.Uri.joinPath(styles, 'webview-base.css'));
    const componentsUri = webview.asWebviewUri(vscode.Uri.joinPath(styles, 'components.css'));
    const scriptUri     = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'webviews', 'home.js')
    );

    // Nonce locks the script tag to exactly this HTML response
    const nonce = randomNonce();

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    style-src ${webview.cspSource};
    script-src 'nonce-${nonce}';
  ">
  <link rel="stylesheet" href="${tokensUri}">
  <link rel="stylesheet" href="${baseUri}">
  <link rel="stylesheet" href="${componentsUri}">
  <title>Kanban2Code</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function randomNonce(): string {
  const bytes = require('crypto').randomBytes(16) as Buffer;
  return bytes.toString('hex');
}

export function activate(context: vscode.ExtensionContext): void {
  const provider = new HomeViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(HomeViewProvider.viewType, provider)
  );
}

export function deactivate(): void {}
