import React, { useCallback, useState } from "react";
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
  const [mouseLocation, setMouseLocation] = React.useState<MouseEvent>();

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsClicked(true);
      setMouseLocation(e.nativeEvent);
    },
    []
  );

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isClicked && mouseLocation && tempo) {
        send({
          method: Method.SET,
          address: "song",
          prop: "tempo",
          value:
            tempo + (e.nativeEvent.clientX > mouseLocation?.clientX ? -1 : 1),
          type: "float",
        });
      }

      setMouseLocation(e.nativeEvent);
    },
    [mouseLocation, send, tempo, isClicked]
  );

  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsClicked(false);
      setMouseLocation(e.nativeEvent);
    },
    []
  );

  if (!tempo) {
    return <Spinner />;
  }

  return (
    <Widget
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h3>{tempo?.toFixed(2)}</h3>
    </Widget>
  );
};
