import GridLayout from "react-grid-layout";

import { FaEdit as Edit } from "react-icons/fa";
import { Mode } from "../../../context/mode/types";
import { useModeContext } from "../../../context/mode/useModeContext";
import { useWidgetLayout } from "../../../hooks/useWidgetLayout";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import styles from "./index.module.scss";

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const {
    dispatch,
    state: { mode },
  } = useModeContext();

  const { widgets, layout, onLayoutChange } = useWidgetLayout({ send });

  return (
    <>
      <GridLayout
        className={styles.grid}
        layout={layout}
        onLayoutChange={onLayoutChange}
        isDraggable={mode === Mode.EDIT}
        cols={12}
        rowHeight={40}
        margin={[4, 4]}
        width={1200}
      >
        {widgets.map(({ id, component }) => (
          <div
            className={`${styles.widget} ${
              mode === Mode.EDIT ? styles.edit : ""
            }`}
            key={id}
          >
            {component}
          </div>
        ))}
      </GridLayout>
      <div className={styles.actions}>
        <IconButton
          size="small"
          onClick={() =>
            dispatch({
              type: "update",
              payload: mode === Mode.EDIT ? Mode.REMOTE : Mode.EDIT,
            })
          }
        >
          <Edit />
        </IconButton>
      </div>
    </>
  );
};
