import { cwd } from 'process';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import {
  FileSystemError,
  FileSystemErrorSerialize,
} from '../../util/error/fileSystemError';
import { colors, decorate, say } from '../../util/console/consoleCommunicater';

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
      say(decorate(colors.gray), `New File: ${path}`);
      return true;
    } catch (err) {
      //新しいディレクトリをつくった時点で、同じファイルが存在する可能性もない。
      //triedMakedir = trueでココに来たら、明らかに異常系である
      if (triedMakedir) {
        //TODO[Log]: more detailed the error message
        say();
        say(
          decorate(colors.white, colors.pink, true),
          ' FATAL ',
          decorate(),
          ' Unknown problem with file writing...'
        );
        say('   ', path);
        return false;
      }
      const error = FileSystemErrorSerialize(err);
      switch (error.code.type) {
        case 'ExistsError':
          if (await this.overrideChecker(path, error)) {
            //TODO[Log]: file Created message
            await unlink(path);
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
          //TODO[Log]: more detailed the error message
          say(
            decorate(colors.white, colors.pink, true),
            ' FATAL ',
            decorate(),
            ' Unknown problem with file writing...'
          );
          console.log(err);
          return false;
      }
    }
  }
  async createDirectory(path: string): Promise<boolean> {
    return mkdir(path, { recursive: true })
      .then(() => {
        say(decorate(colors.gray), `New Directory: ${path}`);
        return true;
      })
      .catch(() => {
        say(
          decorate(colors.white, colors.pink, true),
          ' ERROR ',
          decorate(),
          ' Directory cannot be created'
        );
        return false;
      });
  }
}
