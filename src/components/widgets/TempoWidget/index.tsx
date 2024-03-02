import React, { useCallback, useEffect, useState } from "react";
import { useLiveContext } from "../../../context/live/useLiveContext";
import { Method, OutgoingMessage } from "../../../types/socket";
import { Spinner } from "../../loaders/Spinner";

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

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const mouseLocation = React.useRef<MouseEvent>();
  const [_tempo, setTempo] = useState<number | undefined>(tempo);

  // updates tempo when live context changes
  useEffect(() => {
    setTempo(tempo);
  }, [tempo]);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsClicked(true);
      mouseLocation.current = e.nativeEvent;
    },
    []
  );

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isClicked && mouseLocation && tempo) {
        if (
          mouseLocation.current?.screenY &&
          e.nativeEvent.screenY >= mouseLocation.current?.screenY
        ) {
          setTempo((t) => t && t - 1);
        } else {
          setTempo((t) => t && t + 1);
        }
      }

      mouseLocation.current = e.nativeEvent;
    },
    [tempo, isClicked]
  );

  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      setIsClicked(false);
      send({
        method: Method.SET,
        address: "song",
        prop: "tempo",
        value: _tempo,
        type: "float",
      });
    }, [_tempo, send]);

  if (!tempo) {
    return <Spinner />;
  }

  return (
    <Widget
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h3>{_tempo?.toFixed(2)}</h3>
    </Widget>
  );
};
