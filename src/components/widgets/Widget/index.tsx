import { OutgoingMessage } from "../../../types/socket";

export interface WidgetProps {
  i: string;
  send: (message: OutgoingMessage) => void;
}

export const Widget = ({ i, send }: WidgetProps) => {
  return <div key={i}>widget</div>;
};
