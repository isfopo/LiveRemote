import React, { useMemo } from "react";
import GridLayout from "react-grid-layout";
import { TransportWidget } from "../components/widgets/TransportWidget";
import { OutgoingMessage } from "../types/socket";

export interface WidgetMap {
  id: string;
  component: React.ReactNode;
}

export interface UseWidgetLayoutOptions {
  send: (message: OutgoingMessage) => void;
}

export const useWidgetLayout = ({ send }: UseWidgetLayoutOptions) => {
  const layout: GridLayout.Layout[] = [
    { i: "transport", x: 0, y: 0, w: 3, h: 2 },
  ];

  const widgets = useMemo<WidgetMap[]>(
    () =>
      [
        {
          id: "transport",
          component: <TransportWidget send={send} />,
        },
      ].filter(({ id }) => layout.some(({ i }) => i === id)),
    [send, layout]
  );

  /**
   * Adds a widget to the layout.
   *
   * @param {WidgetMap} widget - the widget to be added
   * @return {void}
   */
  const addWidget = (widget: WidgetMap): void => {
    layout.push({ i: widget.id, x: 3, y: 0, w: 3, h: 2 });
  };

  /**
   * Removes a widget from the layout based on the provided id.
   *
   * @param {string} id - the id of the widget to be removed
   * @return {void}
   */
  const removeWidget = (id: string): void => {
    layout.splice(
      layout.findIndex(({ i }) => i === id),
      1
    );
  };

  return { widgets, layout, addWidget, removeWidget };
};
