import { cwd } from 'process';
import { mkdir, writeFile } from 'fs/promises';
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

  //既にNoEntityErrorによりディレクトリを作ろうとしてから呼び出された場合、triedMakedirがtrueになります。
  async createFile(
    path: string,
    content = '',
    triedMakedir = false
  ): Promise<boolean> {
    // flag: wx ... 既にパスが存在すれば失敗する
    try {
      await writeFile(resolve(this.baseDir, path), content, {
        encoding: 'utf-8',
        flag: 'wx',
      });
      //TODO[Log]: file Created message
      return true;
    } catch (err) {
      //新しいディレクトリをつくった時点で、同じファイルが存在する可能性もない。
      //triedMakedir = trueでココに来たら、明らかに異常系である
      if (triedMakedir) {
        //TODO[Log]: Beautify the error message
        return false;
      }
      const error = FileSystemErrorSerialize(err);
      switch (error.code.type) {
        case 'ExistsError':
          if (await this.overrideChecker(path, error)) {
            //TODO[Log]: file Created message
            return this.createFile(path, content);
          } else {
            return false;
          }
        case 'NoEntityError':
          if (!(await this.createDirectory(dirname(path)))) {
            return false;
          }
          return this.createFile(path, content, true);
        case 'Unknown':
        default:
          //TODO[Log]: Beautify the error message
          console.log(error);
          return false;
      }
    }
  }
  async createDirectory(path: string): Promise<boolean> {
    return mkdir(path, { recursive: true })
      .then(() => {
        //TODO[Log]: directory maked
        return true;
      })
      .catch(() => {
        //TODO[Log]: directory make failed
        return false;
      });
  }
}
