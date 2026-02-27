const fs = require('fs');

const html = fs.readFileSync('kanbanboard-codex.html', 'utf-8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = html.match(/<body>([\s\S]*?)<script>/);
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (styleMatch) fs.writeFileSync('src/webview/ui/board.css', styleMatch[1].trim() + '\n');

if (bodyMatch && scriptMatch) {
  let bodyContent = bodyMatch[1].trim();
  let scriptContent = scriptMatch[1].trim();
  
  // Expose functions to window
  scriptContent = scriptContent.replace('function filterCards()', '(window as any).filterCards = function filterCards()');
  scriptContent = scriptContent.replace('function openCopyDD(e)', '(window as any).openCopyDD = function openCopyDD(e)');
  scriptContent = scriptContent.replace('function copyDefault()', '(window as any).copyDefault = function copyDefault()');
  scriptContent = scriptContent.replace('function copyAct(type)', '(window as any).copyAct = function copyAct(type)');
  scriptContent = scriptContent.replace('function openMenu(e)', '(window as any).openMenu = function openMenu(e)');
  scriptContent = scriptContent.replace('function menuAct(action)', '(window as any).menuAct = function menuAct(action)');
  scriptContent = scriptContent.replace('function closeAll()', '(window as any).closeAll = function closeAll()');
  scriptContent = scriptContent.replace('function updateFilterSummary()', '(window as any).updateFilterSummary = function updateFilterSummary()');
  scriptContent = scriptContent.replace('function showToast(msg)', '(window as any).showToast = function showToast(msg)');

  const tsxContent = `import './board.css';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = \`
${bodyContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}
\`;

  ${scriptContent}
}
`;
  fs.writeFileSync('src/webview/ui/board.tsx', tsxContent);
}
