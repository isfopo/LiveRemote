import GridLayout from "react-grid-layout";
import {
  FaPlus as Add,
  FaTrashAlt as Clear,
  FaEdit as Edit,
} from "react-icons/fa";
import { useDialogContext } from "../../../context/dialog/useDialogContext";
import { Mode } from "../../../context/mode/types";
import { useModeContext } from "../../../context/mode/useModeContext";
import { useWidgetLayout } from "../../../hooks/useWidgetLayout";
import { OutgoingMessage } from "../../../types/socket";
import { IconButton } from "../../buttons/IconButton";
import { AddWidgetDialog } from "../../dialogs/AddWidgetDialog";
import styles from "./index.module.scss";

export interface WidgetGridProps {
  send: (message: OutgoingMessage) => void;
}

export const WidgetGrid = ({ send }: WidgetGridProps) => {
  const {
    dispatch: modeDispatch,
    state: { mode },
  } = useModeContext();

  const { dispatch: dialogDispatch } = useDialogContext();

  const {
    widgets,
    availableWidgets,
    layout,
    onLayoutChange,
    addWidget,
    clearLayout,
  } = useWidgetLayout({
    send,
  });

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
        compactType={null}
        preventCollision={true}
      >
        {widgets.map(({ id, component }) => (
          <div key={id}>{component}</div>
        ))}
      </GridLayout>
      <div className={styles.actions}>
        <IconButton
          size="small"
          onClick={() =>
            dialogDispatch({
              type: "open",
              payload: {
                id: "add-widget",
                component: (
                  <AddWidgetDialog
                    availableWidgets={availableWidgets}
                    onAdd={addWidget}
                  />
                ),
              },
            })
          }
        >
          <Add />
        </IconButton>
        <IconButton
          size="small"
          onClick={() =>
            modeDispatch({
              type: "update",
              payload: mode === Mode.EDIT ? Mode.REMOTE : Mode.EDIT,
            })
          }
        >
          <Edit />
        </IconButton>
        <IconButton size="small" onClick={clearLayout}>
          <Clear />
        </IconButton>
      </div>
    </>
  );
};
