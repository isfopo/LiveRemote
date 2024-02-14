import {
  FaPause as Pause,
  FaPlay as Play,
  FaCircle as Record,
} from "react-icons/fa";
import { OutgoingMessage } from "../../../types/socket";

export interface TransportWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TransportWidget = ({ send }: TransportWidgetProps) => {
  return (
    <>
      <Play />
      <Pause />
      <Record />
    </>
  );
};
