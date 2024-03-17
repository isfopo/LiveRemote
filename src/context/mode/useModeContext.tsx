import { useContext } from "react";
import { ModeContext } from "./ModeProvider";

export const useModeContext = () => {
  return useContext(ModeContext);
};
