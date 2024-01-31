import { useCallback, useEffect, useRef, useState } from "react";

import {
  IncomingMessage,
  Method,
  Status,
  OutgoingMessage,
  SendOptions,
} from "../store/socket/types";

export interface SocketHost {
  url: string;
  hostName: string;
}

export interface UseSocketOptions {
  onConnect?: () => void;
  onMessage?: (e: IncomingMessage) => void;
  onDisconnect?: () => void;
  onError?: (e: Event) => void;
  port?: number;
  base?: string;
  low?: number;
  high?: number;
  maxConcurrentTests?: number;
  timeout?: number;
  lazyLoad?: boolean;
}

export const useSocket = ({
  onConnect,
  onMessage,
  onDisconnect,
  onError,
  port = 9001,
  base = "192.168.1",
  low = 0,
  high = 255,
  timeout = 2000,
  lazyLoad = false,
}: UseSocketOptions = {}) => {
  const index = useRef<number>(low);
  const [candidates, setCandidates] = useState<SocketHost[]>([]);
  const loading = useRef<boolean>(true);

  const socket = useRef<WebSocket | undefined>();
  const [connected, setConnected] = useState<boolean>(false);
  const [code, _setCode] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();

  const find = useCallback(() => {
    const next = () => {
      while (index.current <= high) {
        tryOne(index.current++);
      }
    };

    const tryOne = (ip: number) => {
      const socket = new WebSocket(`ws://${base}.${ip}:${port}`);

      // setTimeout(() => {
      //   const s = socket;
      //   socket = null;
      //   s?.close();
      // }, timeout);

      socket.onopen = () => {
        done();
        next();
      };

      socket.onmessage = (e) => {
        const message = JSON.parse(e.data) as IncomingMessage;
        if (message.method === Method.AUTH) {
          if (message.address === "/socket" && message.prop === "info") {
            if (message.status === Status.SUCCESS) {
              setCandidates((s) =>
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
        loading.current = false;
      }
    };

    next();
  }, [base, high, port, candidates, timeout]);

  useEffect(() => {
    if (!lazyLoad) {
      find();
    }
  }, []);

  const reload = useCallback(() => {
    loading.current = true;
    setCandidates([]);
    index.current = 0;
    find();
  }, [find]);

  const connect = useCallback(
    (url: string) => {
      socket.current = new WebSocket(url);
      if (socket.current) {
        socket.current.onopen = () => {
          setConnected(true);
          onConnect?.();
        };

        socket.current.onclose = () => {
          setConnected(false);
          onDisconnect?.();
        };

        socket.current.onmessage = (e) => {
          const message = JSON.parse(e.data) as IncomingMessage;
          if (message.method === Method.AUTH) {
            if (message.address === "/code" && message.prop === "check") {
              if (message.status === Status.SUCCESS) {
                _setCode(message.result as number);
              } else if (message.status === Status.FAILURE) {
                setError(message.result as string);
              }
            }
          }
          onMessage?.(message);
        };

        socket.current.onerror = (e) => {
          onError?.(e);
        };
      }
    },
    [onConnect, onDisconnect, onError, onMessage]
  );

  const disconnect = useCallback(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = undefined;
    }
    _setCode(undefined);
  }, []);

  const send = useCallback(
    (
      message: OutgoingMessage,
      { codeOverride, bypassCode }: SendOptions = {}
    ) => {
      if (!bypassCode && !code && !codeOverride) {
        setError("Code is not set");
        return;
      }

      setError(undefined);

      const getType = () => {
        return message.type ?? typeof message.value === "number"
          ? "int"
          : typeof message.value;
      };

      if (socket.current) {
        socket.current.send(
          JSON.stringify({
            ...message,
            code: codeOverride ?? code,
            type: getType(),
          })
        );
      }
    },
    [code]
  );

  const setCode = useCallback(
    (input: number) => {
      send({
        method: Method.AUTH,
        address: "/code",
        prop: "check",
      });
    },
    [send]
  );

  return {
    candidates,
    loading: loading.current,
    reload,
    connected,
    connect,
    disconnect,
    send,
    error,
    code,
    setCode,
  };
};
