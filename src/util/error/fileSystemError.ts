interface IErrorCode {
  code: string;
  type: 'NoEntityError' | 'ExistsError' | 'Unknown';
}
interface ISerializableError {
  errno: number;
  code: string;
  syscall: string;
  path: string;
}

const isErrorSerializable = (
  errorObject: unknown
): errorObject is ISerializableError => {
  const error = errorObject as ISerializableError;
  if (!('errno' in error)) return false;
  if (!('code' in error)) return false;
  if (!('syscall' in error)) return false;
  if (!('path' in error)) return false;
  if (typeof error.errno !== 'number') return false;
  if (typeof error.code !== 'string') return false;
  if (typeof error.syscall !== 'string') return false;
  if (typeof error.path !== 'string') return false;
  return true;
};

const errorTypes: IErrorCode[] = [
  { code: 'ENOENT', type: 'NoEntityError' },
  { code: 'EEXIST', type: 'ExistsError' },
];
export class FileSystemError {
  errno: number | undefined;
  code: IErrorCode;
  syscall: string | undefined;
  path: string | undefined;
  constructor(code: string, errno?: number, syscall?: string, path?: string) {
    this.errno = errno;
    this.syscall = syscall;
    this.path = path;
    this.code = errorTypes.find(v => v.code === code) ?? {
      code: code,
      type: 'Unknown',
    };
  }
}
export function FileSystemErrorSerialize(
  errorObject: unknown
): FileSystemError {
  if (isErrorSerializable(errorObject)) {
    return new FileSystemError(
      errorObject.code,
      errorObject.errno,
      errorObject.syscall,
      errorObject.path
    );
  } else {
    return new FileSystemError('');
  }
}
