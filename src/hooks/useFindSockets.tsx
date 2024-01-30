// https://stackoverflow.com/questions/27215757/javascript-find-local-websocket-servers

import { useCallback, useEffect, useRef, useState } from "react";
import { IncomingMessage, Method, Status } from "../types/socket";

export interface SocketHost {
  url: string;
  hostName: string;
}

export interface UseFindSocketsOptions {
  base?: string;
  low?: number;
  high?: number;
  maxConcurrentTests?: number;
  timeout?: number;
  lazyLoad?: boolean;
  onResult?: (servers: SocketHost[]) => void;
}

export const useFindSockets = (
  port = 9001,
  {
    base = "192.168.1",
    low = 0,
    high = 255,
    timeout = 2000,
    lazyLoad = false,
    onResult,
  }: UseFindSocketsOptions = {}
) => {
  const index = useRef<number>(low);
  const [sockets, setSockets] = useState<SocketHost[]>([]);
  const loading = useRef<boolean>(true);

  const run = useCallback(() => {
    const next = () => {
      while (index.current <= high) {
        tryOne(index.current++);
      }
    };

    const tryOne = (ip: number) => {
      let socket: WebSocket | null = new WebSocket(
        `ws://${base}.${ip}:${port}`
      );

      setTimeout(() => {
        const s = socket;
        socket = null;
        s?.close();
      }, timeout);

      socket.onopen = () => {
        done();
        next();
      };

      socket.onmessage = (e) => {
        const message = JSON.parse(e.data) as IncomingMessage;
        if (message.method === Method.AUTH) {
          if (message.address === "/socket" && message.prop === "info") {
            if (message.status === Status.SUCCESS) {
              setSockets((s) =>
                socket
                  ? [
                      ...s,
                      { url: socket.url, hostName: message.result as string },
                    ]
                  : s
              );
            }
          }
        }
      };

      socket.onerror = () => {
        done();
        next();
      };
    };

    const done = () => {
      if (index.current > high) {
        onResult?.(sockets);
        loading.current = false;
      }
    };

    next();
  }, [base, high, onResult, port, sockets, timeout]);

  useEffect(() => {
    if (!lazyLoad) {
      run();
    }
  }, [lazyLoad, run]);

  const reload = useCallback(() => {
    loading.current = true;
    setSockets([]);
    index.current = 0;
    run();
  }, [run]);

  return { sockets, loading: loading.current, reload };
};
