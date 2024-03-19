import React, { useCallback, useEffect, useMemo } from "react";
import GridLayout from "react-grid-layout";
import { TempoWidget } from "../components/widgets/TempoWidget";
import { TransportWidget } from "../components/widgets/TransportWidget";
import { getFromLocalStorage, setInLocalStorage } from "../helpers/storage";
import { Method, OutgoingMessage } from "../types/socket";

export interface Listener {
  address: string;
  prop: string;
}

export interface WidgetMap {
  id: string;
  title: string;
  component: React.ReactNode;
  listeners: Listener[];
  description: string;
  w: number;
  h: number;
}

export interface UseWidgetLayoutOptions {
  send: (message: OutgoingMessage) => void;
}

const defaultLayout = getFromLocalStorage<GridLayout.Layout[]>("layout") || [];

export const useWidgetLayout = ({ send }: UseWidgetLayoutOptions) => {
  const [layout, setLayout] =
    React.useState<GridLayout.Layout[]>(defaultLayout);

  const availableWidgets = useMemo<WidgetMap[]>(
    () => [
      {
        id: "transport",
        title: "Transport",
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
        description: "Handles playback and recording",
        w: 3,
        h: 2,
      },
      {
        id: "tempo",
        title: "Tempo",
        component: <TempoWidget send={send} />,
        listeners: [
          {
            address: "song",
            prop: "tempo",
          },
        ],
        description: "Sets the tempo of the song",
        w: 1,
        h: 1,
      },
    ],
    [send, layout]
  );

  const widgets = useMemo<WidgetMap[]>(
    () =>
      [...availableWidgets].filter(({ id }) =>
        layout.some(({ i }) => i === id)
      ),
    [send, layout]
  );

  useEffect(() => {
    for (const widget of widgets) {
      for (const { address, prop } of widget.listeners) {
        send({
          method: Method.LISTEN,
          address,
          prop,
        });
      }
    }

    return () => {
      for (const widget of widgets) {
        for (const { address, prop } of widget.listeners) {
          send({
            method: Method.UNLISTEN,
            address,
            prop,
          });
        }
      }
    };
  }, [send, widgets]);

  /**
   * A callback that handles the layout change.
   *
   * @param {GridLayout.Layout[]} newLayout - the new layout to be set
   * @return {void}
   */
  const onLayoutChange = (newLayout: GridLayout.Layout[]): void => {
    setLayout(newLayout);
    setInLocalStorage<GridLayout.Layout[]>("layout", newLayout);
  };

  /**
   * Adds a widget to the layout.
   *
   * @param {WidgetMap} widget - the widget to be added
   * @return {void}
   */
  const addWidget = useCallback(
    ({ id, w, h }: WidgetMap): void => {
      setLayout([...layout, { i: id, x: 0, y: 0, w, h }]);
    },
    [layout]
  );

  /**
   * Clears the layout.
   *
   * @return {void}
   */
  const clearLayout = useCallback((): void => {
    setLayout([]);
  }, [layout]);

  return {
    widgets,
    availableWidgets,
    layout,
    onLayoutChange,
    addWidget,
    clearLayout,
  };
};
