export interface SocketState {
  code: number | null;
  host: SocketHost | null;
}

export interface SocketHost {
  url: string;
  name: string;
  socket: WebSocket;
}

export interface FindPayload {
  port: number;
  base?: string;
  low?: number;
  high?: number;
  maxConcurrentTests?: number;
  timeout?: number;
  lazyLoad?: boolean;
}

export interface SendPayload {
  message: OutgoingMessage;
  codeOverride?: number;
}

export enum Method {
  /** Used to check client code */
  AUTH = "AUTH",
  /** calls a method on object */
  CALL = "CALL",
  /** request for the value of a given property */
  GET = "GET",
  /** changes value of given property */
  SET = "SET",
  /** creates listener for given property */
  LISTEN = "LISTEN",
  /** removes lister for given property */
  UNLISTEN = "UNLISTEN",
}

export enum Status {
  SUCCESS = 200,
  FAILURE = 400,
}

export interface Message {
  /** action to take */
  method: Method;
  /** location of property or method */
  address: string;
  /** property or method */
  prop: string;
}

export interface IncomingMessage extends Message {
  /** status of request */
  status: Status;
  /** params to be passed to method */
  result: string | number | boolean | Array<string | number | boolean>;
}

export interface OutgoingMessage extends Message {
  /** params to be passed to method */
  value?: string | number | boolean;
  /** Overrides typeof for python friendly types */
  type?: "int" | "float" | "string" | "boolean";
}

export interface SendOptions {
  codeOverride?: number;
  bypassCode?: boolean;
}
