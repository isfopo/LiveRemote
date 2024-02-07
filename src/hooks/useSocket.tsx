import { useCallback, useEffect, useState } from "react";
import {
  IncomingMessage,
  Method,
  Status,
  SocketHost,
} from "../context/socket/types";
import { send } from "../store/socket/slice";
import { useSocketContext } from "../context/socket/useSocketContext";

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
  find?: boolean;
}

export const useSocket = ({
  onConnect,
  onMessage,
  onDisconnect,
  onError,
  port = 8000,
  base = "192.168.1",
  low = 0,
  high = 255,
  find = false,
}: UseSocketOptions = {}) => {
  const {
    state: { code },
    dispatch,
  } = useSocketContext();

  const [candidates, setCandidates] = useState<SocketHost[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const findSocket = useCallback(() => {
    setLoading(true);
    let index = low;

    const next = () => {
      while (index <= high) {
        tryOne(index++);
      }
    };

    const tryOne = (ip: number) => {
      try {
        const socket = new WebSocket(`ws://${base}.${ip}:${port}`);

        socket.onopen = () => {
          onConnect?.();
        };

        socket.onmessage = (e) => {
          const message = JSON.parse(e.data) as IncomingMessage;
          if (message.method === Method.AUTH) {
            if (message.address === "/socket" && message.prop === "info") {
              if (message.status === Status.SUCCESS) {
                setCandidates((s) =>
                  socket && !s.some((c) => c.url === socket.url)
                    ? [
                        ...s,
                        {
                          url: socket.url,
                          name: message.result as string,
                          socket,
                        },
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
      } catch {}
    };

    const done = () => {
      if (index > high) {
        setLoading(false);
      }
    };

    next();
  }, [base, high, port, candidates]);

  useEffect(() => {
    if (find && !connected) {
      findSocket();
    }
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setCandidates([]);
    findSocket();
  }, [findSocket]);

  const connect = useCallback(
    (host: SocketHost) => {
      if (host.socket.OPEN) {
        dispatch({
          type: "connect",
          payload: host,
        });

        setConnected(true);

        host.socket.onclose = () => {
          setConnected(false);
          onDisconnect?.();
        };

        host.socket.onmessage = (e) => {
          const message = JSON.parse(e.data) as IncomingMessage;
          if (message.method === Method.AUTH) {
            if (message.address === "/code" && message.prop === "check") {
              if (message.status === Status.SUCCESS) {
                dispatch({
                  type: "setCode",
                  payload: message.result as number,
                });
              } else if (message.status === Status.FAILURE) {
                setError(message.result as string);
              }
            }
          }
          onMessage?.(message);
        };

        host.socket.onerror = (e) => {
          onError?.(e);
        };
      }
    },
    [onConnect, onDisconnect, onError, onMessage]
  );

  const showCode = useCallback(() => {
    dispatch({
      type: "send",
      payload: {
        message: { method: Method.AUTH, address: "/code", prop: "show" },
      },
    });
  }, [send]);

  const checkCode = useCallback(
    (input: number) => {
      send({
        message: {
          method: Method.AUTH,
          address: "/code",
          prop: "check",
        },
        codeOverride: input,
      });
    },
    [send]
  );

  return {
    candidates,
    loading,
    reload,
    connected,
    connect,
    send,
    error,
    code,
    checkCode,
    showCode,
  };
};
