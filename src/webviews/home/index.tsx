import React from 'react';
import { createRoot } from 'react-dom/client';
import { Home } from './Home';

// Styles (tokens.css + webview-base.css) are loaded as <link> tags
// by the extension's HTML template. Nothing to inject here.

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<Home />);
}
