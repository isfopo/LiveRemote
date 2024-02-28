import React, { PropsWithChildren } from "react";
import styles from "./index.module.scss";

export interface WidgetProps
  extends PropsWithChildren,
    React.HTMLAttributes<HTMLDivElement> {}

export const Widget = ({ children, ...props }: WidgetProps) => {
  return (
    <div {...props} className={styles.container}>
      {children}
    </div>
  );
};
