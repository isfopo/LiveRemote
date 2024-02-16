import { FaCircle as Record } from "react-icons/fa";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import { PlayButton } from "../../buttons/PlayButton";
import { StopButton } from "../../buttons/StopButton";

export interface TransportWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TransportWidget = ({ send }: TransportWidgetProps) => {
  return (
    <>
      <PlayButton send={send} />
      <StopButton send={send} />
      <IconButton>
        <Record />
      </IconButton>
    </>
  );
};
