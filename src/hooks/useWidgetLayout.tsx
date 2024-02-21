import React, { useMemo } from "react";
import GridLayout from "react-grid-layout";
import { TransportWidget } from "../components/widgets/TransportWidget";
import { getFromLocalStorage, setInLocalStorage } from "../helpers/storage";
import { OutgoingMessage } from "../types/socket";

export interface Listener {
  address: string;
  prop: string;
}

export interface WidgetMap {
  id: string;
  component: React.ReactNode;
  listeners: Listener[];
}

export interface UseWidgetLayoutOptions {
  send: (message: OutgoingMessage) => void;
}

const defaultLayout = getFromLocalStorage<GridLayout.Layout[]>("layout") || [
  { i: "transport", x: 0, y: 0, w: 3, h: 2 },
];

export const useWidgetLayout = ({ send }: UseWidgetLayoutOptions) => {
  const [layout, setLayout] =
    React.useState<GridLayout.Layout[]>(defaultLayout);

  const widgets = useMemo<WidgetMap[]>(
    () =>
      [
        {
          id: "transport",
          component: <TransportWidget send={send} />,
          listeners: [
            {
              address: "song",
              prop: "is_playing",
            },
            {
              address: "song",
              prop: "record_mode",
            },
          ],
        },
      ].filter(({ id }) => layout.some(({ i }) => i === id)),
    [send, layout]
  );

  /**
   * A callback that handles the layout change.
   *
   * @param {GridLayout.Layout[]} newLayout - the new layout to be set
   * @return {void}
   */
  const onLayoutChange = (newLayout: GridLayout.Layout[]) => {
    setLayout(newLayout);
    setInLocalStorage<GridLayout.Layout[]>("layout", newLayout);
  };

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

  return { widgets, layout, onLayoutChange, addWidget, removeWidget };
};
