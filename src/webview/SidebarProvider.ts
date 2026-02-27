import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { sendMessage } from '../orchestrator/orchestrator';
import { stringifyTaskFile } from '../services/frontmatter';
import { resolveProviderConfig } from '../services/provider-service';
import { findTaskById } from '../services/scanner';
import { generateTaskFile } from '../services/task-generator';
import { TaskWatcher } from '../services/task-watcher';
import { buildWorkspaceSnapshot } from '../services/workspace-snapshot';
import type { ChatMessage } from '../types/orchestrator';
import type { ProviderConfig } from '../types/provider';
import type { WorkspaceSnapshot } from '../types/snapshot';
import type { Task } from '../types/task';
import { ensureSafePath } from '../workspace/validation';
import { executeRunTaskPayload } from './run-task';
import {
  createEnvelope,
  validateEnvelope,
  type SendMessagePayload,
  type SaveTaskPayload,
} from './messaging';

interface SidebarProviderOptions {
  kanbanRoot: string;
  workspaceRoot: string;
}

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'kanban2code.sidebar';

  private view?: vscode.WebviewView;
  private snapshot: WorkspaceSnapshot | null = null;
  private activeProvider: ProviderConfig | null = null;
  private selectedProviderId: string | null = null;
  private chatHistory: ChatMessage[] = [];
  private streamGeneration = 0;
  private watcher: TaskWatcher;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly options: SidebarProviderOptions,
  ) {
    this.watcher = new TaskWatcher(options.kanbanRoot);
    this.watcher.on('event', () => {
      void this.refreshSnapshotAndBroadcast();
    });
    this.watcher.start();
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist')],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      await this.handleWebviewMessage(data);
    });

    webviewView.onDidDispose(() => {
      this.watcher.dispose();
    });

    void this.sendInitState();
  }

  private async handleWebviewMessage(data: unknown): Promise<void> {
    try {
      const envelope = validateEnvelope(data);

      switch (envelope.type) {
        case 'RequestState':
          await this.sendInitState();
          break;
        case 'SendMessage':
          await this.handleSendMessage(envelope.payload);
          break;
        case 'GenerateTask': {
          const relativePath = await generateTaskFile(this.options.kanbanRoot, envelope.payload);
          this.postMessage(createEnvelope('TaskGenerated', {
            path: relativePath,
            title: envelope.payload.title,
          }));
          await this.refreshSnapshotAndBroadcast();
          break;
        }
        case 'RunTask': {
          await executeRunTaskPayload(
            this.options.kanbanRoot,
            this.options.workspaceRoot,
            envelope.payload,
          );
          break;
        }
        case 'SaveTask':
          await this.handleSaveTask(envelope.payload);
          break;
        case 'CancelStream':
          this.streamGeneration += 1;
          this.postMessage(createEnvelope('MessageComplete', {}));
          break;
        default:
          break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.postMessage(createEnvelope('Error', { message }));
    }
  }

  private async handleSendMessage(payload: SendMessagePayload): Promise<void> {
    const snapshot = this.snapshot ?? await buildWorkspaceSnapshot(this.options.kanbanRoot);
    this.snapshot = snapshot;

    const requestedProviderId = payload.providerId?.trim();
    const providerId = requestedProviderId
      ? this.resolveProviderId(snapshot, requestedProviderId)
      : (this.selectedProviderId ?? this.resolveDefaultProviderId(snapshot));
    if (!providerId) {
      throw new Error('No provider configured. Add a provider in .kanban2code/_providers.');
    }

    this.selectedProviderId = providerId;
    const userMessage: ChatMessage = {
      role: payload.role,
      content: payload.content,
    };
    this.chatHistory.push(userMessage);

    const generation = ++this.streamGeneration;
    let assistantContent = '';

    for await (const token of sendMessage({
      kanbanRoot: this.options.kanbanRoot,
      provider: providerId,
      messages: this.chatHistory,
      workspaceSnapshot: snapshot,
    })) {
      if (generation !== this.streamGeneration) {
        return;
      }

      assistantContent += token;
      this.postMessage(createEnvelope('StreamChunk', { token }));
    }

    if (generation !== this.streamGeneration) {
      return;
    }

    this.chatHistory.push({ role: 'assistant', content: assistantContent });
    this.postMessage(createEnvelope('MessageComplete', {}));
  }

  private async handleSaveTask(payload: SaveTaskPayload): Promise<void> {
    const snapshot = this.snapshot ?? await buildWorkspaceSnapshot(this.options.kanbanRoot);
    const existing = this.findTaskByFilePath(snapshot, payload.taskFilePath);
    if (!existing) {
      throw new Error(`Task not found: ${payload.taskFilePath}`);
    }

    const fileName = path.basename(existing.filePath);
    const targetDir = payload.project
      ? path.join(this.options.kanbanRoot, 'projects', payload.project, payload.phase ?? '')
      : path.join(this.options.kanbanRoot, 'inbox');
    const normalizedTargetDir = targetDir.endsWith(path.sep)
      ? targetDir.slice(0, -1)
      : targetDir;
    const targetPath = path.join(normalizedTargetDir, fileName);

    await ensureSafePath(this.options.kanbanRoot, targetPath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    let original = '';
    try {
      original = await fs.readFile(existing.filePath, 'utf8');
    } catch {
      original = '';
    }

    const updated: Task = {
      ...existing,
      filePath: targetPath,
      title: payload.title,
      stage: payload.stage,
      agent: payload.agent,
      provider: payload.provider,
      tags: payload.tags ?? [],
      contexts: payload.contexts ?? [],
      skills: payload.skills ?? [],
      project: payload.project,
      phase: payload.phase,
      content: payload.content,
    };

    const serialized = stringifyTaskFile(updated, original);
    await fs.writeFile(targetPath, serialized, 'utf8');

    if (targetPath !== existing.filePath) {
      await fs.rm(existing.filePath, { force: true });
    }

    await this.refreshSnapshotAndBroadcast();
  }

  private findTaskByFilePath(snapshot: WorkspaceSnapshot, taskFilePath: string): Task | null {
    for (const stage of ['inbox', 'plan', 'code', 'audit', 'completed'] as const) {
      const found = snapshot.tasks[stage].find((task) => task.filePath === taskFilePath);
      if (found) return found;
    }
    return null;
  }

  private resolveDefaultProviderId(snapshot: WorkspaceSnapshot): string | null {
    const defaultProvider = snapshot.config.providerDefaults?.coder;
    if (defaultProvider) {
      const exact = snapshot.providers.find((provider) => provider.id === defaultProvider);
      if (exact) return exact.id;
    }

    const firstValid = snapshot.providers.find((provider) => provider.config);
    return firstValid?.id ?? null;
  }

  private resolveProviderId(snapshot: WorkspaceSnapshot, providerId: string): string {
    const provider = snapshot.providers.find((candidate) => candidate.id === providerId);
    if (!provider || !provider.config) {
      throw new Error(`Provider not found or invalid: ${providerId}`);
    }
    return provider.id;
  }

  private async sendInitState(): Promise<void> {
    try {
      const snapshot = await buildWorkspaceSnapshot(this.options.kanbanRoot);
      this.snapshot = snapshot;

      const providerId = this.selectedProviderId ?? this.resolveDefaultProviderId(snapshot);
      this.selectedProviderId = providerId;
      this.activeProvider = providerId ? await resolveProviderConfig(this.options.kanbanRoot, providerId) ?? null : null;

      this.postMessage(createEnvelope('InitState', {
        kanbanRootExists: true,
        workspaceSnapshot: snapshot,
        activeProvider: this.activeProvider,
      }));
    } catch {
      const emptySnapshot: WorkspaceSnapshot = {
        config: {
          version: '1.0.0',
          agents: {},
          tags: { categories: {} },
          stages: {},
          preferences: {},
        },
        tasks: { inbox: [], plan: [], code: [], audit: [], completed: [] },
        agents: [],
        contexts: [],
        skills: [],
        providers: [],
        metadata: {
          taskCounts: { inbox: 0, plan: 0, code: 0, audit: 0, completed: 0 },
          totalTasks: 0,
          agentCount: 0,
          contextCount: 0,
          skillCount: 0,
          providerCount: 0,
        },
      };

      this.postMessage(createEnvelope('InitState', {
        kanbanRootExists: false,
        workspaceSnapshot: emptySnapshot,
        activeProvider: null,
      }));
    }
  }

  private async refreshSnapshotAndBroadcast(): Promise<void> {
    const snapshot = await buildWorkspaceSnapshot(this.options.kanbanRoot);
    this.snapshot = snapshot;
    this.postMessage(createEnvelope('WorkspaceUpdated', { workspaceSnapshot: snapshot }));
  }

  private postMessage(message: unknown): void {
    this.view?.webview.postMessage(message);
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.js'));
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <title>Kanban2Code</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let value = '';
  for (let i = 0; i < 32; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

export async function canResolveTaskFile(kanbanRoot: string, taskFilePath: string): Promise<boolean> {
  const taskId = path.basename(taskFilePath, '.md');
  const task = await findTaskById(kanbanRoot, taskId);
  return Boolean(task);
}
