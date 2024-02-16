import { FaPlay as Play } from "react-icons/fa";
import { useLiveContext } from "../../../context/live/useLiveContext";
import { Method, OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../IconButton";
import styles from "./index.module.scss";

export interface PlayButtonProps {
  send: (message: OutgoingMessage) => void;
}

export const PlayButton = ({ send }: PlayButtonProps) => {
  const {
    state: {
      song: { isPlaying },
    },
  } = useLiveContext();

  return (
    <IconButton
      onClick={() =>
        send({
          method: Method.SET,
          address: "/song",
          prop: "is_playing",
          value: !isPlaying,
          type: "boolean",
        })
      }
      className={isPlaying ? styles["is-playing"] : ""}
    >
      <Play />
    </IconButton>
  );
};
