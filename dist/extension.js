"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));

// src/webview/SidebarProvider.ts
var vscode = __toESM(require("vscode"));
var path = __toESM(require("node:path"));

// src/webview/messaging.ts
var isObject = (value) => typeof value === "object" && value !== null;
var isWebviewToHostMessage = (value) => {
  if (!isObject(value) || typeof value.type !== "string") {
    return false;
  }
  if (value.type === "RequestTaskSnapshot" || value.type === "ShowKanbanBoard") {
    return true;
  }
  if (value.type !== "SendChatMessage" || !isObject(value.payload)) {
    return false;
  }
  if (typeof value.payload.message !== "string" || typeof value.payload.provider !== "string") {
    return false;
  }
  if ("selectedTaskId" in value.payload && value.payload.selectedTaskId !== void 0 && typeof value.payload.selectedTaskId !== "string") {
    return false;
  }
  return true;
};

// src/webview/SidebarProvider.ts
var SidebarProvider = class {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
    this.webviewView = null;
  }
  static {
    this.viewType = "kanban2code-sidebar";
  }
  resolveWebviewView(webviewView) {
    this.webviewView = webviewView;
    const { webview } = webviewView;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist", "webview.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist", "webview.css")
    );
    const nonce = getNonce();
    webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code</title>
  </head>
  <body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
    webview.onDidReceiveMessage((message) => {
      void this.handleWebviewMessage(message);
    });
  }
  async handleWebviewMessage(rawMessage) {
    if (!this.webviewView || !isWebviewToHostMessage(rawMessage)) {
      return;
    }
    if (rawMessage.type === "RequestTaskSnapshot") {
      await this.postTaskSnapshot();
      return;
    }
    if (rawMessage.type === "ShowKanbanBoard") {
      vscode.commands.executeCommand("kanban2code.openBoard");
      return;
    }
    const allTasks = await this.getWorkspaceTasks();
    let selectedTaskId = rawMessage.payload.selectedTaskId;
    let selectedTask = selectedTaskId ? allTasks.find((task) => task.id === selectedTaskId) ?? null : null;
    if (selectedTaskId && !selectedTask) {
      selectedTaskId = void 0;
      const resetMessage = {
        type: "TaskSelectionReset",
        payload: {
          reason: "Selected task is no longer available. Scope reset to general chat."
        }
      };
      void this.webviewView.webview.postMessage(resetMessage);
    }
    const scopeLabel = selectedTask ? `${selectedTask.stage} \u2022 ${selectedTask.title}` : "general chat";
    const responseMessage = {
      type: "OrchestratorResponse",
      payload: {
        message: `Context received (${scopeLabel}) via provider ${rawMessage.payload.provider}.`
      }
    };
    void this.webviewView.webview.postMessage(responseMessage);
    await this.postTaskSnapshot(allTasks);
  }
  async postTaskSnapshot(preloadedTasks) {
    if (!this.webviewView) {
      return;
    }
    const tasks = preloadedTasks ?? await this.getWorkspaceTasks();
    const snapshotMessage = {
      type: "TaskSnapshot",
      payload: { tasks }
    };
    void this.webviewView.webview.postMessage(snapshotMessage);
  }
  async getWorkspaceTasks() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return [];
    }
    const taskUris = await Promise.all([
      vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, ".kanban2code/inbox/**/*.md")
      ),
      vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, ".kanban2code/projects/**/*.md")
      )
    ]);
    const allUris = [...taskUris[0], ...taskUris[1]];
    const tasks = await Promise.all(allUris.map((uri) => this.readTaskSnapshotItem(uri, workspaceFolder)));
    return tasks.filter((task) => task !== null).sort((left, right) => left.title.localeCompare(right.title));
  }
  async readTaskSnapshotItem(taskUri, workspaceFolder) {
    const relativePath = path.posix.normalize(
      path.relative(workspaceFolder.uri.fsPath, taskUri.fsPath).split(path.sep).join(path.posix.sep)
    );
    const raw = await vscode.workspace.fs.readFile(taskUri);
    const content = Buffer.from(raw).toString("utf8");
    const stage = this.parseStage(content);
    const title = this.parseTitle(content, taskUri);
    return {
      id: relativePath,
      title,
      stage
    };
  }
  parseTitle(content, taskUri) {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch && headingMatch[1].trim().length > 0) {
      return headingMatch[1].trim();
    }
    const fileName = path.basename(taskUri.fsPath, path.extname(taskUri.fsPath));
    return fileName.trim() || "Untitled task";
  }
  parseStage(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return "unknown";
    }
    const stageLine = frontmatterMatch[1].split("\n").find((line) => line.trimStart().startsWith("stage:"));
    if (!stageLine) {
      return "unknown";
    }
    const rawStage = stageLine.split(":").slice(1).join(":").trim().toLowerCase();
    if (rawStage === "inbox" || rawStage === "capture" || rawStage === "plan" || rawStage === "code" || rawStage === "audit" || rawStage === "completed") {
      return rawStage;
    }
    return "unknown";
  }
};
function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

// src/webview/KanbanPanel.ts
var vscode2 = __toESM(require("vscode"));
var KanbanPanel = class _KanbanPanel {
  constructor(panel, extensionUri) {
    this._disposables = [];
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }
  static {
    this.viewType = "kanban2code-board";
  }
  static createOrShow(extensionUri) {
    const column = vscode2.window.activeTextEditor ? vscode2.window.activeTextEditor.viewColumn : void 0;
    if (_KanbanPanel.currentPanel) {
      _KanbanPanel.currentPanel._panel.reveal(column);
      return;
    }
    const panel = vscode2.window.createWebviewPanel(
      _KanbanPanel.viewType,
      "Kanban Board",
      column || vscode2.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode2.Uri.joinPath(extensionUri, "dist")],
        retainContextWhenHidden: true
      }
    );
    _KanbanPanel.currentPanel = new _KanbanPanel(panel, extensionUri);
  }
  _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }
  dispose() {
    _KanbanPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
  _getHtmlForWebview(webview) {
    const scriptUri = webview.asWebviewUri(
      vscode2.Uri.joinPath(this._extensionUri, "dist", "board.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode2.Uri.joinPath(this._extensionUri, "dist", "board.css")
    );
    const nonce = getNonce2();
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src https://fonts.googleapis.com https://fonts.gstatic.com; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; script-src 'nonce-${nonce}' 'unsafe-inline'; img-src data: https:;" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code Board</title>
  </head>
  <body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
  }
};
function getNonce2() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

// src/extension.ts
function activate(context) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode3.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
  );
  context.subscriptions.push(
    vscode3.commands.registerCommand("kanban2code.openBoard", () => {
      KanbanPanel.createOrShow(context.extensionUri);
    })
  );
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
