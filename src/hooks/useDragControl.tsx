import { useDrag } from "@use-gesture/react";
import React from "react";

export interface Location {
  x: number;
  y: number;
}

export interface useDragControlOptions {
  onIncrease: () => void;
  onDecrease: () => void;
  onDragEnd: () => void;
}

export const useDragControl = ({
  onIncrease,
  onDecrease,
  onDragEnd,
}: useDragControlOptions) => {
  const mouseLocation = React.useRef<Location | undefined>();

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
          onDecrease();
        } else {
          onIncrease();
        }
      }

      mouseLocation.current = {
        x,
        y,
      };
    }

    if (last) {
      onDragEnd();
    }
  });

  return {
    bind,
  };
};
