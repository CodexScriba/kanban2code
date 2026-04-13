/**
 * Message contract between webviews and the extension host.
 *
 * Webview → extension: post a WebviewMessage via vscodeApi.postMessage()
 * Extension → webview: dispatch a HostMessage via window.postMessage()
 *
 * Add new commands here as new surfaces are wired up in extension.ts.
 */

export type WebviewCommand =
  | 'createKanban'
  | 'openSidebar'
  | 'openChat'
  | 'connectOpenClaw';

export interface WebviewMessage {
  command: WebviewCommand;
}
