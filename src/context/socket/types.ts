export interface SocketState {
  code: number | null;
  host: SocketHost | null;
  candidates: Candidate[];
  loading: boolean;
  connected: boolean;
  error: string | undefined;
}

export interface SocketHost {
  url: string;
  name: string;
  socket: WebSocket;
}

export type Candidate = Omit<SocketHost, 'socket'>

export interface SendPayload {
  message: OutgoingMessage;
  codeOverride?: number;
}

export interface SocketActions {
  found: Candidate[];
  connect: Candidate;
  send: SendPayload;
  checkCode: number;
  setCode: number;
  disconnect: null;
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
