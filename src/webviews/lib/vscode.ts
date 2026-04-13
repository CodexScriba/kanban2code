import { WebviewMessage } from './messages';

// acquireVsCodeApi() is injected by VS Code at webview runtime.
// It must be called exactly once, so we cache the result here.
declare function acquireVsCodeApi(): {
  postMessage(message: WebviewMessage): void;
};

const api = acquireVsCodeApi();

export function postMessage(message: WebviewMessage): void {
  api.postMessage(message);
}
