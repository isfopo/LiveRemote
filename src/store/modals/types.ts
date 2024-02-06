
export interface ModalPayload {
  /**
   * unique identifier for modals that can be duplicated (like the video upload session modal)
   * for modals that are not duplicated, id and type will be the same
   */
  id: string;
  component?: JSX.Element;
}
export interface ModalsState {
    /** Either the enum value for a modal to open or the modal itself */
    activeModal: ModalPayload | null;
    previousModal: ModalPayload | null;
}