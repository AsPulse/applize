export type second = number;

export interface ICookie {
  key: string;
  value: string;
}

export interface ISetCookie extends ICookie {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'None' | 'Lax' | 'Strict';
  maxAge?: second;
  domain?: string;
  path?: string;
}
