export type IActions<T> = {
  [Key in keyof T]: {
    type: Key;
    payload: T[Key];
  };
}[keyof T];
