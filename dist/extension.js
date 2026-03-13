"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const SidebarProvider_1 = require("./webview/SidebarProvider");
const KanbanPanel_1 = require("./webview/KanbanPanel");
const TaskEditorPanel_1 = require("./webview/TaskEditorPanel");
const SettingsPanel_1 = require("./webview/SettingsPanel");
const task_scanner_1 = require("./services/task-scanner");
const task_service_1 = require("./services/task-service");
const settings_service_1 = require("./services/settings-service");
const queue_service_1 = require("./services/queue-service");
const alibaba_service_1 = require("./services/alibaba-service");
function activate(context) {
    const scannerRuntime = {
        findFiles: (globPattern) => vscode.workspace.findFiles(globPattern),
        readFile: (uri) => vscode.workspace.fs.readFile(uri),
        toRelativePath: (uri) => vscode.workspace.asRelativePath(uri, false),
        createWatcher: (globPattern) => vscode.workspace.createFileSystemWatcher(globPattern),
        createEventEmitter: () => new vscode.EventEmitter()
    };
    const taskScanner = new task_scanner_1.TaskScanner(scannerRuntime);
    const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
    const workspaceRoot = workspaceFolders[0]?.uri.fsPath;
    const taskService = new task_service_1.TaskService(workspaceRoot ?? '');
    const settingsService = new settings_service_1.SettingsService(workspaceRoot ?? '');
    const alibabaService = new alibaba_service_1.AlibabaService(workspaceRoot ?? '', settingsService, undefined, {
        envSearchRoots: [context.extensionUri.fsPath, ...workspaceFolders.map((folder) => folder.uri.fsPath)]
    });
    const queueService = new queue_service_1.QueueService(workspaceRoot ?? '', taskService, settingsService, {
        promptForValidation: async (taskPath, validation) => {
            const firstError = validation.errors[0];
            if (firstError) {
                void vscode.window.showWarningMessage(firstError.message);
            }
            await vscode.commands.executeCommand('kanban2code.openTaskEditor', {
                taskId: taskPath,
                focusTargets: validation.focusTargets
            });
        }
    });
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri, taskScanner, queueService, alibabaService);
    context.subscriptions.push(taskScanner, queueService, sidebarProvider);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarProvider_1.SidebarProvider.viewType, sidebarProvider));
    context.subscriptions.push(TaskEditorPanel_1.TaskEditorPanel.onDidSaveTask(({ taskPath }) => {
        void queueService.handleTaskSaved(taskPath);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kanban2code.openBoard', () => {
        if (!workspaceRoot) {
            void vscode.window.showWarningMessage('Open a workspace folder to use Kanban board drag-and-drop persistence.');
            return;
        }
        KanbanPanel_1.KanbanPanel.createOrShow(context.extensionUri, taskScanner, taskService, settingsService, queueService);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kanban2code.openTaskEditor', (arg) => {
        if (!workspaceRoot) {
            void vscode.window.showWarningMessage('Open a workspace folder to use the task editor.');
            return;
        }
        const taskPath = typeof arg === 'string'
            ? arg
            : arg &&
                typeof arg === 'object' &&
                'taskId' in arg &&
                typeof arg.taskId === 'string'
                ? arg.taskId
                : undefined;
        const focusTargets = arg &&
            typeof arg === 'object' &&
            'focusTargets' in arg &&
            Array.isArray(arg.focusTargets)
            ? (arg.focusTargets ?? [])
            : undefined;
        TaskEditorPanel_1.TaskEditorPanel.createOrShow(context.extensionUri, taskService, taskPath, focusTargets);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('kanban2code.openSettings', (arg) => {
        if (!workspaceRoot) {
            void vscode.window.showWarningMessage('Open a workspace folder to configure Kanban2Code settings.');
            return;
        }
        const projectSlug = arg &&
            typeof arg === 'object' &&
            'projectSlug' in arg &&
            typeof arg.projectSlug === 'string'
            ? arg.projectSlug
            : undefined;
        SettingsPanel_1.SettingsPanel.createOrShow(context.extensionUri, settingsService, projectSlug);
    }));
}
function deactivate() {
    // No-op for scaffold.
}
//# sourceMappingURL=extension.js.map