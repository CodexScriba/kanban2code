export const workspace = {
  workspaceFolders: [],
  createFileSystemWatcher: () => ({
    onDidCreate: () => ({ dispose() {} }),
    onDidChange: () => ({ dispose() {} }),
    onDidDelete: () => ({ dispose() {} }),
    dispose() {},
  }),
  onDidRenameFiles: () => ({ dispose() {} }),
};

export class RelativePattern {
  constructor(public base: string, public pattern: string) {}
}

export const Uri = {
  file: (fsPath: string) => ({ fsPath }),
};

const outputChannels: { name: string; lines: string[] }[] = [];
export const __outputChannels = outputChannels;

export const window = {
  createOutputChannel: (name: string) => {
    const entry = { name, lines: [] as string[] };
    outputChannels.push(entry);
    return {
      appendLine: (line: string) => entry.lines.push(line),
      clear: () => entry.lines.splice(0, entry.lines.length),
      dispose: () => {},
      name,
      _lines: entry.lines,
    };
  },
  showErrorMessage: (..._args: unknown[]) => Promise.resolve(undefined),
  showInformationMessage: (..._args: unknown[]) => Promise.resolve(undefined),
  activeTextEditor: null as unknown,
};

export const commands = {
  executeCommand: (_command: string, ..._args: unknown[]) => Promise.resolve(undefined),
};

export const env = {
  clipboard: {
    writeText: (_text: string) => Promise.resolve(),
  },
};

export const ViewColumn = { One: 1 };

export default { workspace, RelativePattern, Uri, window, commands, env, ViewColumn };
