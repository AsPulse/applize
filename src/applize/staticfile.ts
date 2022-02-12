import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
interface IStaticFile {
  path: string;
  data: Buffer;
  hash: string;
}

export class StaticFileManager {
  files: IStaticFile[] = [];
  async readFile(path: string): Promise<IStaticFile> {
    const search = this.files.find(v => v.path === path);
    if (search) return search;
    const data = await readFile(path);
    const hash = createHash('sha256').update(data).digest('hex');
    const file = { data, hash, path };
    this.files.push(file);
    return file;
  }
}
