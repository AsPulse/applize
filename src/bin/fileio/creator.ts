import { cwd } from 'process';
import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import {
  FileSystemError,
  FileSystemErrorSerialize,
} from '../../util/error/fileSystemError';

//上書きするかの確認を取るラムダ関数 ( trueを返すと上書きする )
type TOverrideChecker = (
  path: string,
  error: FileSystemError
) => Promise<boolean>;

export class FileCreator {
  baseDir: string;
  overrideChecker: TOverrideChecker;
  constructor(overrideChecker: TOverrideChecker, baseDir: string = cwd()) {
    this.baseDir = baseDir;
    this.overrideChecker = overrideChecker;
  }
  async createFile(path: string, content = ''): Promise<boolean> {
    // flag: wx ... 既にパスが存在すれば失敗する
    try {
      await writeFile(resolve(this.baseDir, path), content, {
        encoding: 'utf-8',
        flag: 'wx',
      });
      return true;
    } catch (err) {
      const error = FileSystemErrorSerialize(err);
      switch (error.code.type) {
        case 'ExistsError':
          if (await this.overrideChecker(path, error)) {
            return this.createFile(path, content);
          } else {
            return false;
          }
        case 'NoEntityError':
          await this.createDirectory(dirname(path));
          return this.createFile(path, content);
        case 'Unknown':
        default:
          //TODO: Beautify the error message
          console.log(error);
          return false;
      }
    }
  }
  async createDirectory(path: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
