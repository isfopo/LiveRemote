import GridLayout from "react-grid-layout";

import { useState } from "react";
import { FaEdit as Edit } from "react-icons/fa";
import { useWidgetLayout } from "../../../hooks/useWidgetLayout";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import styles from "./index.module.scss";

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { widgets, layout } = useWidgetLayout({ send });

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
