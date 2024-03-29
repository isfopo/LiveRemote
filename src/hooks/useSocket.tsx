import { useCallback, useEffect, useMemo, useState } from "react";
import { range } from "../helpers/arrays";
import {
  Candidate,
  IncomingMessage,
  Method,
  OutgoingMessage,
  SocketHost,
  Status,
} from "../types/socket";

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
  auto?: boolean;
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
  auto = false,
}: UseSocketOptions = {}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [host, setHost] = useState<SocketHost | null>(null);
  const [code, setCode] = useState<number | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const connected = useMemo<boolean>(() => {
    if (!(host?.socket && code)) {
      return false;
    }

    return host.socket.readyState === WebSocket.OPEN;
  }, [host, code]);

  const find = useCallback(async () => {
    setLoading(true);
    setCandidates([]);

    for (const ip in range(high - low, low)) {
      const socket = new WebSocket(`ws://${base}.${ip}:${port}`);

      socket.onmessage = (e) => {
        const message = JSON.parse(e.data) as IncomingMessage;

        if (
          message.method === Method.AUTH &&
          message.address === "/socket" &&
          message.prop === "info" &&
          message.status === Status.SUCCESS &&
          socket
        ) {
          setCandidates((c) => [
            ...c,
            {
              url: socket.url,
              name: message.result as string,
            },
          ]);
          socket.close();
        }
      };
    }
  }, [base, port, high, low]);

  useEffect(() => {
    if (auto && !host) {
      find();
    }
  }, [find, auto, host]);

  const connect = useCallback(
    (candidate: Candidate) => {
      const socket = new WebSocket(candidate.url);

      socket.onclose = () => {
        onDisconnect?.();
      };

      socket.onmessage = (e) => {
        const message = JSON.parse(e.data) as IncomingMessage;
        if (message.method === Method.AUTH) {
          if (message.address === "code" && message.prop === "check") {
            if (message.status === Status.SUCCESS) {
              setCode(message.result as number);
            } else if (message.status === Status.FAILURE) {
              setError(message.result as string);
            }
          }
        } else {
          onMessage?.(message);
        }
      };

      socket.onerror = (e) => {
        onError?.(e);
      };

      setHost({
        ...candidate,
        socket,
      });

      onConnect?.();
    },
    [onConnect, onDisconnect, onMessage, onError]
  );

  const send = useCallback(
    (message: OutgoingMessage) => {
      if (host?.socket.readyState === WebSocket.OPEN) {
        host?.socket.send(JSON.stringify({ ...message, code }));
      }
    },
    [host, code]
  );

  const showCode = useCallback(() => {
    send({ method: Method.AUTH, address: "code", prop: "show" });
  }, [send]);

  const checkCode = useCallback(
    (input: number) => {
      host?.socket.send(
        JSON.stringify({
          method: Method.AUTH,
          address: "code",
          prop: "check",
          code: input,
        })
      );
    },
    [host]
  );

  const disconnect = useCallback(() => {
    host?.socket.close();
    setCandidates([]);
    setHost(null);
  }, [host]);

  return {
    candidates,
    host,
    loading,
    connected,
    error,
    code,
    find,
    send,
    connect,
    disconnect,
    checkCode,
    showCode,
  };
};
