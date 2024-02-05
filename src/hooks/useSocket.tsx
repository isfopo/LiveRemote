import { useCallback, useEffect, useRef, useState } from "react";

import {
  IncomingMessage,
  Method,
  Status,
  OutgoingMessage,
  SendOptions,
  SocketHost,
} from "../store/socket/types";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { connectHost, setCode } from "../store/socket/slice";
import { useDispatch } from "react-redux";

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
  lazyLoad?: boolean;
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
  lazyLoad = false,
}: UseSocketOptions = {}) => {
  const dispatch = useAppDispatch();
  const { host, code } = useAppSelector((state) => state.socket);

  const [candidates, setCandidates] = useState<SocketHost[]>([]);
  const loading = useRef<boolean>(true);

  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const find = useCallback(() => {
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
                  socket
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
        loading.current = false;
      }
    };

    next();
  }, [base, high, port, candidates]);

  useEffect(() => {
    if (!lazyLoad && !connected) {
      find();
    }
  }, []);

  const reload = useCallback(() => {
    loading.current = true;
    setCandidates([]);
    find();
  }, [find]);

  const connect = useCallback(
    (host: SocketHost) => {
      if (host.socket.OPEN) {
        dispatch(connectHost(host));
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
                dispatch(setCode(message.result as number));
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

  const disconnect = useCallback(() => {
    if (host?.socket) {
      host.socket.close();
    }
    dispatch(setCode(null));
  }, []);

  const send = useCallback(
    (message: OutgoingMessage, { codeOverride }: SendOptions = {}) => {
      if (!code && !codeOverride) {
        setError("Code is not set");
        return;
      }

      setError(undefined);

      const getType = () => {
        return message.type ?? typeof message.value === "number"
          ? "int"
          : typeof message.value;
      };

      if (host?.socket) {
        host.socket.send(
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

  const showCode = useCallback(() => {
    send({
      method: Method.AUTH,
      address: "/code",
      prop: "show",
    });
  }, [send]);

  const checkCode = useCallback(
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
    checkCode,
    showCode,
  };
};
