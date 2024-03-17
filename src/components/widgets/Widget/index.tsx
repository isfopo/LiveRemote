import React, { PropsWithChildren } from "react";
import { Mode } from "../../../context/mode/types";
import { useModeContext } from "../../../context/mode/useModeContext";
import styles from "./index.module.scss";

export interface WidgetProps
  extends PropsWithChildren,
    React.HTMLAttributes<HTMLDivElement> {}

export const Widget = ({ children, ...props }: WidgetProps) => {
  const {
    state: { mode },
  } = useModeContext();

  return (
    <div
      {...props}
      className={`${styles.container} ${mode === Mode.EDIT ? styles.edit : ""}`}
    >
      {children}
    </div>
  );
};
