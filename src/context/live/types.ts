import { IncomingMessage } from "../socket/types";

export type LiveState = {
  song: Song;
};

export type Song = {
  isPlaying: boolean;
  recordMode: boolean;
};

export interface LiveActions {
  update: IncomingMessage;
  reset: null;
}

export type LiveAction = {
  [Key in keyof LiveActions]: {
    type: Key;
    payload: LiveActions[Key];
  };
}[keyof LiveActions];
