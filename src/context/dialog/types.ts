export interface DialogPayload {
  id: string;
  component: JSX.Element;
  title?: string;
  onClose?: () => void;
}

export interface DialogState {
  activeDialog: DialogPayload | null;
  previousDialog: DialogPayload | null;
}

export interface DialogActions {
  open: DialogPayload;
  close: null;
}
