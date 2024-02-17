import GridLayout from "react-grid-layout";

import React, { useMemo, useState } from "react";
import { FaEdit as Edit } from "react-icons/fa";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import { TransportWidget } from "../../widgets/TransportWidget";
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
        id: "transport",
        component: <TransportWidget send={send} />,
      },
    ],
    [send]
  );

  const layout: GridLayout.Layout[] = [
    { i: "transport", x: 0, y: 0, w: 3, h: 2 },
  ];

  return (
    <>
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
      <div className={styles.actions}>
        <IconButton size="small" onClick={() => setEdit(!edit)}>
          <Edit />
        </IconButton>
      </div>
    </>
  );
};
