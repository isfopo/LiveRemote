import { FaCircle as Record } from "react-icons/fa";
import { useLiveContext } from "../../../context/live/useLiveContext";
import { Method, OutgoingMessage } from "../../../types/socket";
import styles from "./index.module.scss";

import { IconButton } from "../IconButton";

export interface RecordButtonProps {
  send: (message: OutgoingMessage) => void;
}

export const RecordButton = ({ send }: RecordButtonProps) => {
  const {
    state: {
      song: { recordMode },
    },
  } = useLiveContext();

  return (
    <IconButton
      onClick={() =>
        send({
          method: Method.SET,
          address: "/song",
          prop: "is_playing",
          value: !recordMode,
          type: "boolean",
        })
      }
      className={recordMode ? styles["is-playing"] : ""}
    >
      <Record />
    </IconButton>
  );
};
