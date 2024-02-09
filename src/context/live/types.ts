export type LiveState = {
  song: Song;
};

export type Song = {
  isPlaying: boolean;
  recordMode: boolean;
};

export interface LiveActions {
  reset: null;
}

export type LiveAction = {
  [Key in keyof LiveActions]: {
    type: Key;
    payload: LiveActions[Key];
  };
}[keyof LiveActions];
