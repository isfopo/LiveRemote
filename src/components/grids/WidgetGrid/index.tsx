import GridLayout from "react-grid-layout";

import React, { useMemo, useState } from "react";
import { FaEdit as Edit } from "react-icons/fa";
import { OutgoingMessage } from "../../../types/socket";
import { TransportWidget } from "../../widgets/TransportWidget";
import { Widget } from "../../widgets/Widget";
import styles from "./index.module.scss";

export interface WidgetMap {
  id: string;
  component: React.ReactNode;
}

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const widgets = useMemo<WidgetMap[]>(
    () => [
      {
        id: "a",
        component: <TransportWidget send={send} />,
      },
      {
        id: "b",
        component: <Widget>hi</Widget>,
      },
    ],
    [send]
  );

  const layout: GridLayout.Layout[] = [
    { i: "a", x: 0, y: 0, w: 3, h: 2 },
    { i: "b", x: 1, y: 0, w: 1, h: 2 },
    { i: "c", x: 3, y: 0, w: 1, h: 2 },
  ];

  return (
    <>
      <Edit onClick={() => setEdit(!edit)} />
      <GridLayout
        className={styles.grid}
        layout={layout}
        isDraggable={edit}
        cols={12}
        rowHeight={20}
        width={1200}
      >
        {widgets.map(({ id, component }) => (
          <div key={id}>{component}</div>
        ))}
      </GridLayout>
    </>
  );
};
