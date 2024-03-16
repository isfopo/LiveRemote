import { useEffect, useState } from "react";
import { useLiveContext } from "../../../context/live/useLiveContext";
import { useDragControl } from "../../../hooks/useDragControl";
import { Method, OutgoingMessage } from "../../../types/socket";
import { Spinner } from "../../loaders/Spinner";
import { Widget } from "../Widget";

export interface Location {
  x: number;
  y: number;
}

export interface TempoWidgetProps {
  send: (message: OutgoingMessage) => void;
}

export const TempoWidget = ({ send }: TempoWidgetProps) => {
  const {
    state: {
      song: { tempo },
    },
  } = useLiveContext();

  const [_tempo, setTempo] = useState<number | undefined>(tempo);

  // updates tempo when live context changes
  useEffect(() => {
    setTempo(tempo);
  }, [tempo]);

  const { bind } = useDragControl({
    onIncrease: () => setTempo((t) => t && t + 1),
    onDecrease: () => setTempo((t) => t && t - 1),
    onDragEnd: () => {
      send({
        method: Method.SET,
        address: "song",
        prop: "tempo",
        value: _tempo,
        type: "float",
      });
    },
  });

  if (!tempo) {
    return <Spinner />;
  }

  return (
    <Widget {...bind()}>
      <h3>{_tempo?.toFixed(2)}</h3>
    </Widget>
  );
};
