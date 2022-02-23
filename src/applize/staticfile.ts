import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { promisify } from 'util';
import { brotliCompress, gzip } from 'zlib';
interface IStaticFile {
  path: string;
  data: {
    original: Buffer,
    brotli: Buffer,
    gzip: Buffer,
  };
  hash: string;
}

export class StaticFileManager {
  files: IStaticFile[] = [];
  async readFile(path: string): Promise<IStaticFile> {
    const search = this.files.find(v => v.path === path);
    if (search) return search;
    const brotliCompressAsync = promisify(brotliCompress);
    const gzipCompressAsync = promisify(gzip);
    const original = await readFile(path);
    const data = {
      original,
      brotli: await brotliCompressAsync(original),
      gzip: await gzipCompressAsync(original)
    };

    const hash = createHash('sha256').update(data.original).digest('hex');
    const file = { data, hash, path };
    this.files.push(file);
    return file;
  }
}
