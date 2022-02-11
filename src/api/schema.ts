type JSONSerializable = string | number | null | boolean | JSONSerializable[];
export type JSONStyle = {
  [key: string]: JSONSerializable | JSONStyle | JSONStyle[];
};

export interface IAPISchema {
  input: JSONStyle;
  output: JSONStyle;
}

export type ServerAPISchema = { [key: string]: IAPISchema };
