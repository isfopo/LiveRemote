import { useContext } from "react";
import { SocketContext } from "./SocketProvider";

export const useSocketContext = () => {
  return useContext(SocketContext);
};
