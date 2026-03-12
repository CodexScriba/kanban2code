import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { AlibabaService } from './alibaba-service';
import { SettingsService } from './settings-service';

interface UriLike {
  fsPath: string;
}

const createNodeFsAdapter = () => ({
  readFile: async (uri: UriLike): Promise<Uint8Array> => {
    const buffer = await fs.readFile(uri.fsPath);
    return new Uint8Array(buffer);
  },
  writeFile: async (uri: UriLike, content: Uint8Array): Promise<void> => {
    await fs.mkdir(path.dirname(uri.fsPath), { recursive: true });
    await fs.writeFile(uri.fsPath, Buffer.from(content));
  },
  createDirectory: async (uri: UriLike): Promise<void> => {
    await fs.mkdir(uri.fsPath, { recursive: true });
  }
});

const toFileUri = (filePath: string): UriLike => ({ fsPath: filePath });

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();
  const settingsService = new SettingsService(workspaceRoot, {
    fs: createNodeFsAdapter(),
    toFileUri
  });
  const alibabaService = new AlibabaService(workspaceRoot, settingsService);

  const reply = await alibabaService.sendMessage({
    message:
      'Reply with a one-line confirmation that the Alibaba Coding Plan chat integration is reachable, and mention the model name you used.'
  });

  process.stdout.write(`${reply}\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(
      [
        'Alibaba smoke test failed.',
        'Expected config:',
        '- `ALIBABA_API_KEY` in your environment or workspace `.env`',
        '- `providersAndModels.providers.alibaba.endpoint` in `.kanban2code/settings.json`',
        '- Optional model override in `.kanban2code/settings.json` using `providersAndModels.providers.alibaba.models`',
        `Workspace: ${path.resolve(process.cwd())}`,
        `Error: ${message}`
      ].join('\n') + '\n'
    );
    process.exitCode = 1;
  });
}
