import * as Ariakit from "@ariakit/react";
import React from "react";
import styles from "./index.module.scss";

export interface IconButtonProps extends Ariakit.ButtonProps {
  children: React.JSX.Element;
  size?: "small" | "medium" | "large";
}

export const IconButton = ({
  children,
  size = "medium",
  className,
  ...props
}: IconButtonProps) => {
  console.log(props);
  return (
    <Ariakit.Button
      {...props}
      className={`${className} ${styles.button} ${styles[size]}`}
    >
      {children}
    </Ariakit.Button>
  );
};
