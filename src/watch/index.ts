import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import { watch } from 'chokidar';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { dirname, resolve } from 'path';
import { getAllFilesInDir } from '../builder/applize';

export function applizeWatch(
  directory: string,
  target: string,
  builder: string
) {
  console.log(directory);
  console.log(target);
  console.log(dirname(target));

  let targetProcess: null | ChildProcessWithoutNullStreams = null;

  new Watcher(
    directory,
    builder,
    target,
    () =>
      new Promise(resolve => {
        const childProcess = spawn('node', [builder]);
        childProcess.stdout.on('data', chunk => {
          process.stdout.write(chunkLog(chunk));
        });
        childProcess.stderr.on('data', chunk => {
          process.stdout.write(chunkLog(chunk));
        });
        childProcess.on('exit', code => {
          resolve(code === 0);
        });
      }),
    async () => {
      await new Promise<void>(resolve => {
        if (targetProcess !== null) {
          targetProcess.on('exit', () => {
            resolve();
          });
          targetProcess.kill('SIGTERM');
        } else {
          resolve();
        }
      });

      targetProcess = null;

      targetProcess = spawn('node', [target]);
      targetProcess.stdout.on('data', chunk => {
        process.stdout.write(chunkLog(chunk));
      });
      targetProcess.stderr.on('data', chunk => {
        process.stdout.write(chunkLog(chunk));
      });
    }
  );
}
export function chunkLog(chunk: unknown): string {
  try {
    return (chunk as { toString: () => string }).toString();
  } catch {
    return '';
  }
}
export class Watcher {
  changes = 0;
  doublingThreshold = 300;
  refreshing = false;

  constructor(
    public directory: string,
    builder: string,
    public target: string,
    public refresher: () => Promise<boolean>,
    public reExecutor: () => Promise<void>
  ) {
    watch(directory, {
      ignored: [builder, dirname(target), /node_modules/, /\.git/],
    }).on('all', () => {
      if (this.refreshing) return;
      const ourChange = ++this.changes;
      setTimeout(() => {
        if (ourChange !== this.changes) return;
        void this.refresh();
      }, this.doublingThreshold);
    });
  }

  async refresh() {
    if (this.refreshing) {
      return;
    }
    this.refreshing = true;
    const beforeSnapshot = await getSnapShot(this.directory, this.target);
    if (await this.refresher()) {
      void this.reExecutor();
    }
    const afterSnapshot = await getSnapShot(this.directory, this.target);
    this.refreshing = false;
    if (!equalSnapshot(beforeSnapshot, afterSnapshot)) {
      void this.refresh();
    }
  }
}

type Snapshot = {
  digest: string;
  path: string;
};
export async function getSnapShot(
  directory: string,
  target: string
): Promise<Snapshot[]> {
  const basedir = dirname(target);
  const hashes = (await getAllFilesInDir(directory, []))
    .filter(v => {
      if (v.directory.startsWith(basedir)) return false;
      return true;
    })
    .map(
      v =>
        new Promise<Snapshot>(promiseResolve => {
          const shasum = createHash('sha1');
          const path = resolve(v.directory, v.dirent.name);
          const stream = createReadStream(path);
          stream.on('data', chunk => shasum.update(chunk));
          stream.on('close', () =>
            promiseResolve({
              digest: shasum.digest('hex'),
              path,
            })
          );
        })
    );
  return Promise.all(hashes);
}

export function equalSnapshot(a: Snapshot[], b: Snapshot[]) {
  const aKeys = a.map(v => v.path);
  const bKeys = b.map(v => v.path);
  const keys = [...new Set([...aKeys, ...bKeys])];
  if (
    keys.filter(v => !aKeys.includes(v)).length > 0 ||
    keys.filter(v => !bKeys.includes(v)).length > 0
  ) {
    return false;
  }
  return keys.every(
    v => a.find(e => e.path === v)?.digest === b.find(e => e.path === v)?.digest
  );
}
