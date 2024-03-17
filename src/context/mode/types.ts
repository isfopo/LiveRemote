export enum Mode {
  /** Main remote mode. Widgets can be interacted with. */
  REMOTE = "REMOTE",
  /** Edit mode. Widgets can be dragged, but not interacted with */
  EDIT = "EDIT",
}

export interface ModeState {
  mode: Mode;
}

export interface ModeActions {
  update: Mode;
}
