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
  const mouseLocation = React.useRef<MouseEvent | TouchEvent>();
  const [_tempo, setTempo] = useState<number | undefined>(tempo);

  // updates tempo when live context changes
  useEffect(() => {
    setTempo(tempo);
  }, [tempo]);

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      setIsClicked(true);
      mouseLocation.current = e.nativeEvent;
    },
    []
  );

  const handleMouseMove = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      e.preventDefault();

      let deltaX: number | null = null;
      let deltaY: number | null = null;
      let shouldIncrease: boolean | null = null;

      if (isClicked && mouseLocation.current && tempo) {
        if (
          e.nativeEvent instanceof MouseEvent &&
          mouseLocation.current instanceof MouseEvent
        ) {
          deltaX = Math.abs(
            e.nativeEvent.screenX - mouseLocation.current.screenX
          );
          deltaY = Math.abs(
            e.nativeEvent.screenY - mouseLocation.current.screenY
          );
          shouldIncrease =
            !!mouseLocation.current?.screenY &&
            e.nativeEvent.screenY <= mouseLocation.current?.screenY;
        } else if (
          e.nativeEvent instanceof TouchEvent &&
          mouseLocation.current instanceof TouchEvent
        ) {
          deltaX = Math.abs(
            e.nativeEvent.touches[0].screenX -
              mouseLocation.current.touches[0].screenX
          );
          deltaY = Math.abs(
            e.nativeEvent.touches[0].screenY -
              mouseLocation.current.touches[0].screenY
          );
          shouldIncrease =
            !!mouseLocation.current?.touches[0].screenY &&
            e.nativeEvent.touches[0].screenY <=
              mouseLocation.current?.touches[0].screenY;
        }

        if (!!deltaX && !!deltaY && deltaX < deltaY) {
          if (shouldIncrease) {
            setTempo((t) => t && t - 1);
          } else {
            setTempo((t) => t && t + 1);
          }
        }
      }

      mouseLocation.current = e.nativeEvent;
    },
    [tempo, isClicked]
  );

  const handleMouseUp = useCallback(() => {
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
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <h3>{_tempo?.toFixed(2)}</h3>
    </Widget>
  );
};
