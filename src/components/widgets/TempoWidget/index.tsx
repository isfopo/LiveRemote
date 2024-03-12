import { useDrag } from "@use-gesture/react";
import React, { useEffect, useState } from "react";
import { useLiveContext } from "../../../context/live/useLiveContext";
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

  const mouseLocation = React.useRef<Location | undefined>();
  const [_tempo, setTempo] = useState<number | undefined>(tempo);

  // updates tempo when live context changes
  useEffect(() => {
    setTempo(tempo);
  }, [tempo]);

  const bind = useDrag(({ movement: [x, y], last }) => {
    if (mouseLocation.current === undefined) {
      mouseLocation.current = {
        x,
        y,
      };
    } else {
      const deltaX = Math.abs(x - mouseLocation.current?.x);
      const deltaY = Math.abs(y - mouseLocation.current?.y);

      if (deltaX < deltaY) {
        if (!!mouseLocation.current?.x && y >= mouseLocation.current?.y) {
          setTempo((t) => t && t - 1);
        } else {
          setTempo((t) => t && t + 1);
        }
      }

      mouseLocation.current = {
        x,
        y,
      };
    }

    if (last) {
      send({
        method: Method.SET,
        address: "song",
        prop: "tempo",
        value: _tempo,
        type: "float",
      });
    }
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
