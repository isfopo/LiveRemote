import { OutgoingMessage } from "../../../types/socket";

import { Widget } from "../Widget";

export interface TempoWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TempoWidget = ({ send }: TempoWidgetProps) => {
  return (
    <Widget>
      <p>Tempo</p>
    </Widget>
  );
};
