import * as T from 'io-ts';

type JSONSerializable = string | number | null | boolean | JSONSerializable[];
export type JSONStyle = {
  [key: string]: JSONSerializable | JSONStyle | JSONStyle[];
};
