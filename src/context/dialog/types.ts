export interface DialogPayload {
  id: string;
  component?: JSX.Element;
}

export interface DialogState {
  activeDialog: DialogPayload | null;
  previousDialog: DialogPayload | null;
}

export interface DialogActions {
  open: DialogPayload;
  close: null;
}
