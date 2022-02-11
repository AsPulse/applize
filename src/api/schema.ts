
type JSONSerializable = string | number | null | boolean | JSONSerializable[];
type JSONStyle = { [key: string]: JSONSerializable | JSONStyle };


export interface IAPISchema {
  name: string;
  input: JSONStyle;
  output: JSONStyle
}


export class APISchema<T extends IAPISchema[]> {

}

const hoge = new APISchema<[]>();

