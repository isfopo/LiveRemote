import * as Ariakit from "@ariakit/react";
import { WidgetMap } from "../../../hooks/useWidgetLayout";

export interface AddWidgetDialogProps {
  availableWidgets: WidgetMap[];
  onAdd: (widget: WidgetMap) => void;
}

export const AddWidgetDialog = ({
  availableWidgets,
  onAdd,
}: AddWidgetDialogProps) => {
  return (
    <Ariakit.Group>
      {availableWidgets.map((widget) => (
        <button key={widget.id} type="button" onClick={() => onAdd(widget)}>
          {widget.id}
        </button>
      ))}
    </Ariakit.Group>
  );
};
