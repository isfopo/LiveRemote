import GridLayout from "react-grid-layout";

import { useState } from "react";
import { OutgoingMessage } from "../../../types/socket";
import { Widget } from "../../widgets/Widget";
import styles from "./index.module.scss";

export interface WidgetMap {
  id: string;
  component: Element;
}

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const [widgets, setWidgets] = useState([
    {
      id: "a",
      component: <Widget i="a" send={send} />,
    },
    {
      id: "b",
      component: <Widget i="a" send={send} />,
    },
  ]);

  const layout: GridLayout.Layout[] = [
    { i: "a", x: 0, y: 0, w: 1, h: 2 },
    { i: "b", x: 1, y: 0, w: 1, h: 2 },
    { i: "c", x: 3, y: 0, w: 1, h: 2 },
  ];

  return (
    <GridLayout
      className={styles.grid}
      layout={layout}
      isDraggable={true}
      cols={12}
      rowHeight={20}
      width={1200}
    >
      {widgets.map(({ id, component }) => (
        <div key={id}>{component}</div>
      ))}
    </GridLayout>
  );
};
