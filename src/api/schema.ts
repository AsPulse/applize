type JSONSerializable = string | number | null | boolean | JSONSerializable[];
type JSONStyle = { [key: string]: JSONSerializable | JSONStyle };

export interface IAPISchema {
  input: JSONStyle;
  output: JSONStyle;
}

export type ServerAPISchema = { [key: string]: IAPISchema };
