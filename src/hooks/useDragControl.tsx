import { useDrag } from "@use-gesture/react";
import React from "react";
import { Mode } from "../context/mode/types";
import { useModeContext } from "../context/mode/useModeContext";

export interface Location {
  x: number;
  y: number;
}

export interface useDragControlOptions {
  onIncrease: () => void;
  onDecrease: () => void;
  onDragEnd: () => void;
  direction?: "x" | "y";
  disabled?: boolean;
}

export const useDragControl = ({
  onIncrease,
  onDecrease,
  onDragEnd,
  direction = "y",
  disabled = false,
}: useDragControlOptions) => {
  const mouseLocation = React.useRef<Location | undefined>();

  const {
    state: { mode },
  } = useModeContext();

  const bind = useDrag(({ movement: [x, y], last }) => {
    if (mode === Mode.EDIT) {
      return;
    }

    if (mouseLocation.current === undefined) {
      mouseLocation.current = {
        x,
        y,
      };
    } else {
      const deltaX = Math.abs(x - mouseLocation.current?.x);
      const deltaY = Math.abs(y - mouseLocation.current?.y);

      if (direction === "y" ? deltaX < deltaY : deltaY < deltaX) {
        if (!!mouseLocation.current?.x && y >= mouseLocation.current?.y) {
          !disabled && onDecrease();
        } else {
          !disabled && onIncrease();
        }
      }

      mouseLocation.current = {
        x,
        y,
      };
    }

    if (last) {
      !disabled && onDragEnd();
    }
  });

  return {
    bind,
  };
};
