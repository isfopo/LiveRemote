import { FaPause as Pause, FaCircle as Record } from "react-icons/fa";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import { PlayButton } from "../../buttons/PlayButton";

export interface TransportWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TransportWidget = ({ send }: TransportWidgetProps) => {
  return (
    <>
      <PlayButton send={send} />
      <IconButton>
        <Pause />
      </IconButton>
      <IconButton>
        <Record />
      </IconButton>
    </>
  );
};
