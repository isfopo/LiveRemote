import * as Ariakit from "@ariakit/react";
import React from "react";
import styles from "./index.module.scss";

export interface IconButtonProps extends Ariakit.ButtonProps {
  children: React.JSX.Element;
  size?: "small" | "medium" | "large";
}

export const IconButton = ({ children, size = "medium" }: IconButtonProps) => {
  return (
    <Ariakit.Button className={`${styles.button} ${styles[size]}`}>
      {children}
    </Ariakit.Button>
  );
};
