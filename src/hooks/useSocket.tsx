import { useCallback, useRef, useState } from "react";
import {
  IncomingMessage,
  Method,
  OutgoingMessage,
  SendOptions,
  Status,
} from "../types/socket";

export interface UseSocketOptions {
  onConnect?: () => void;
  onMessage?: (e: IncomingMessage) => void;
  onDisconnect?: () => void;
  onError?: (e: Event) => void;
}

export const useSocket = ({
  onConnect,
  onMessage,
  onDisconnect,
  onError,
}: UseSocketOptions = {}) => {
  const socket = useRef<WebSocket | undefined>();
  const [connected, setConnected] = useState<boolean>(false);
  const [code, _setCode] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();

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
      send(
        {
          method: Method.AUTH,
          address: "/code",
          prop: "check",
        },
        { codeOverride: input }
      );
    },
    [send]
  );

  return { connected, connect, disconnect, send, error, code, setCode };
};
