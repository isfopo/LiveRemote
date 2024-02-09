import { useContext } from "react";
import { DialogContext } from "./DialogProvider";

export const useDialogContext = () => {
  return useContext(DialogContext);
};
