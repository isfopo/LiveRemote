import GridLayout from "react-grid-layout";
import { OutgoingMessage } from "../../../types/socket";
import styles from "./index.module.scss";

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const layout: GridLayout.Layout[] = [
    { i: "a", x: 0, y: 0, w: 1, h: 2 },
    { i: "b", x: 1, y: 0, w: 1, h: 2 },
    { i: "c", x: 3, y: 0, w: 1, h: 2 },
  ];

  return (
    <GridLayout
      className={styles.grid}
      layout={layout}
      cols={12}
      rowHeight={20}
      width={1200}
    >
      <div key="a">hello</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  );
};
