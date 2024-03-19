import * as Ariakit from "@ariakit/react";
import { WidgetMap } from "../../../hooks/useWidgetLayout";
import styles from "./index.module.scss";

export interface AddWidgetDialogProps {
  availableWidgets: WidgetMap[];
  onAdd: (widget: WidgetMap) => void;
}

export const AddWidgetDialog = ({
  availableWidgets,
  onAdd,
}: AddWidgetDialogProps) => {
  return (
    <Ariakit.Group className={styles.group}>
      {availableWidgets.map((widget) => (
        <button
          className={styles.option}
          key={widget.id}
          type="button"
          onClick={() => onAdd(widget)}
        >
          {widget.id}
        </button>
      ))}
    </Ariakit.Group>
  );
};
