import { useLiveContext } from "../../../context/live/useLiveContext";
import { OutgoingMessage } from "../../../types/socket";

import { Widget } from "../Widget";

export interface TempoWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TempoWidget = ({ send }: TempoWidgetProps) => {
  const {
    state: {
      song: { tempo },
    },
  } = useLiveContext();

  return (
    <Widget>
      <h3>{tempo?.toFixed(2)}</h3>
    </Widget>
  );
};
