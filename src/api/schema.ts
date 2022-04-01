import * as T from 'io-ts';

type JSONSerializable = string | number | null | boolean | JSONSerializable[];
export type JSONStyle = {
  [key: string]: JSONSerializable | JSONStyle | JSONStyle[];
};

export type APITypesGeneral = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: { input: T.Type<any>; output: T.Type<any> };
};
