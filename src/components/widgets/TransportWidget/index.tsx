import { OutgoingMessage } from "../../../types/socket";
import { PlayButton } from "../../buttons/PlayButton";
import { RecordButton } from "../../buttons/RecordButton";
import { StopButton } from "../../buttons/StopButton";
import { Widget } from "../Widget";

export interface TransportWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TransportWidget = ({ send }: TransportWidgetProps) => {
  return (
    <Widget>
      <PlayButton send={send} />
      <StopButton send={send} />
      <RecordButton send={send} />
    </Widget>
  );
};
