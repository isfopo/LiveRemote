import { useContext } from "react";
import { LiveContext } from "./LiveProvider";

export const useLiveContext = () => {
  return useContext(LiveContext);
};
