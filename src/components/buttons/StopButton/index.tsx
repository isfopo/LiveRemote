import { FaStop as Stop } from "react-icons/fa";
import { Method, OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../IconButton";

export interface StopButtonProps {
  send: (message: OutgoingMessage) => void;
}

export const StopButton = ({ send }: StopButtonProps) => {
  return (
    <IconButton
      onClick={() =>
        send({
          method: Method.SET,
          address: "song",
          prop: "is_playing",
          value: 0,
          type: "boolean",
        })
      }
    >
      <Stop />
    </IconButton>
  );
};
