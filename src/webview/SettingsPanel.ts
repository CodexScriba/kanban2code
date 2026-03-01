import * as vscode from 'vscode';
import { SettingsService } from '../services/settings-service';
import type { Settings, SettingsSection } from '../types/settings';
import {
  isWebviewToHostMessage,
  type OpenSettingsMessage,
  type ResetSectionMessage,
  type ResetToDefaultsMessage,
  type SaveSettingsMessage,
  type SettingsLoadedMessage
} from './messaging';

export class SettingsPanel {
  public static currentPanel: SettingsPanel | undefined;
  public static readonly viewType = 'kanban2code-settings';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private readonly settingsService: SettingsService;
  private readonly disposables: vscode.Disposable[] = [];
  private currentProjectSlug: string | undefined;
  private isDisposed = false;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    settingsService: SettingsService,
    projectSlug?: string
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.settingsService = settingsService;
    this.currentProjectSlug = projectSlug;

    this.update();
    void this.postSettings();

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (message: unknown) => {
        void this.handleWebviewMessage(message);
      },
      null,
      this.disposables
    );
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    settingsService: SettingsService,
    projectSlug?: string
  ): void {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (SettingsPanel.currentPanel) {
      SettingsPanel.currentPanel.panel.reveal(column);
      void SettingsPanel.currentPanel.openSettings(projectSlug);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      SettingsPanel.viewType,
      'Kanban2Code Settings',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
        retainContextWhenHidden: true
      }
    );

    SettingsPanel.currentPanel = new SettingsPanel(panel, extensionUri, settingsService, projectSlug);
  }

  public dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    SettingsPanel.currentPanel = undefined;
    this.panel.dispose();

    while (this.disposables.length > 0) {
      const disposable = this.disposables.pop();
      disposable?.dispose();
    }
  }

  private update(): void {
    this.panel.webview.html = this.getHtmlForWebview(this.panel.webview);
  }

  private async handleWebviewMessage(rawMessage: unknown): Promise<void> {
    if (!isWebviewToHostMessage(rawMessage)) {
      return;
    }

    if (rawMessage.type === 'OpenSettings') {
      await this.handleOpenSettings(rawMessage);
      return;
    }

    if (rawMessage.type === 'SaveSettings') {
      await this.handleSaveSettings(rawMessage);
      return;
    }

    if (rawMessage.type === 'ResetSection') {
      await this.handleResetSection(rawMessage);
      return;
    }

    if (rawMessage.type === 'ResetToDefaults') {
      await this.handleResetToDefaults(rawMessage);
    }
  }

  private async handleOpenSettings(message: OpenSettingsMessage): Promise<void> {
    await this.openSettings(message.payload?.projectSlug);
  }

  private async handleSaveSettings(message: SaveSettingsMessage): Promise<void> {
    try {
      const projectSlug = this.resolveProjectSlug(message.payload.projectSlug);
      await this.settingsService.updateSettings(message.payload.settings as Partial<Settings>, projectSlug);
      await this.postSettings(projectSlug);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to save settings: ${errorMessage}`);
    }
  }

  private async handleResetSection(message: ResetSectionMessage): Promise<void> {
    try {
      const projectSlug = this.resolveProjectSlug(message.payload.projectSlug);
      await this.settingsService.resetSection(message.payload.section as SettingsSection, projectSlug);
      await this.postSettings(projectSlug);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to reset settings section: ${errorMessage}`);
    }
  }

  private async handleResetToDefaults(message: ResetToDefaultsMessage): Promise<void> {
    try {
      const projectSlug = this.resolveProjectSlug(message.payload?.projectSlug);
      await this.settingsService.resetToDefaults(projectSlug);
      await this.postSettings(projectSlug);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to reset settings defaults: ${errorMessage}`);
    }
  }

  private async openSettings(projectSlug?: string): Promise<void> {
    this.currentProjectSlug = projectSlug;
    await this.postSettings(projectSlug);
  }

  private resolveProjectSlug(projectSlug?: string): string | undefined {
    if (projectSlug !== undefined) {
      this.currentProjectSlug = projectSlug;
      return projectSlug;
    }

    return this.currentProjectSlug;
  }

  private async postSettings(projectSlug = this.currentProjectSlug): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings(projectSlug);
      const message: SettingsLoadedMessage = {
        type: 'SettingsLoaded',
        payload: {
          settings: settings as unknown as Record<string, unknown>,
          projectSlug
        }
      };
      void this.panel.webview.postMessage(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      void vscode.window.showErrorMessage(`Failed to load settings: ${errorMessage}`);
    }
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'settings.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'settings.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${styleUri}" />
    <title>Kanban2Code Settings</title>
  </head>
  <body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
  }
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';

  for (let i = 0; i < 32; i += 1) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return nonce;
}
