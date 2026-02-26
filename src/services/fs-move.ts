import * as fs from 'fs/promises';

type FsErrorWithCode = { code?: string };

function isFsErrorWithCode(error: unknown): error is FsErrorWithCode {
  return typeof error === 'object' && error !== null && 'code' in error;
}

/**
 * Move a file or directory, falling back to copy+delete when a cross-device
 * rename is not permitted (EXDEV).
 */
export async function movePath(sourcePath: string, targetPath: string): Promise<void> {
  try {
    await fs.rename(sourcePath, targetPath);
    return;
  } catch (error) {
    if (!isFsErrorWithCode(error) || error.code !== 'EXDEV') {
      throw error;
    }
  }

  const stat = await fs.stat(sourcePath);
  if (stat.isDirectory()) {
    await fs.cp(sourcePath, targetPath, { recursive: true });
    await fs.rm(sourcePath, { recursive: true, force: true });
    return;
  }

  await fs.copyFile(sourcePath, targetPath);
  await fs.unlink(sourcePath);
}
