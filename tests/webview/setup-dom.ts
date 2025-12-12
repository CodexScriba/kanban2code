import { JSDOM } from 'jsdom';

// Ensure document/window exist before React Testing Library is imported.
if (typeof (globalThis as any).document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  (globalThis as any).window = dom.window as any;
  (globalThis as any).document = dom.window.document as any;
  (globalThis as any).navigator = dom.window.navigator as any;
  (globalThis as any).HTMLElement = dom.window.HTMLElement as any;
  (globalThis as any).DragEvent = dom.window.DragEvent as any;
  (globalThis as any).MessageEvent = dom.window.MessageEvent as any;
}

