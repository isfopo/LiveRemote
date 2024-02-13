import * as Ariakit from "@ariakit/react";
import { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { useLiveContext } from "../../context/live/useLiveContext";
import { useSocket } from "../../hooks/useSocket";
import { IncomingMessage } from "../../types/socket";

export const Remote = () => {
  const { dispatch: dialogDispatch } = useDialogContext();
  const { dispatch: liveDispatch } = useLiveContext();

  const handleMessage = useCallback(
    (message: IncomingMessage) => {
      liveDispatch({
        type: "update",
        payload: message,
      });
    },
    [liveDispatch]
  );

  const {
    candidates,
    host,
    code,
    find,
    connect,
    showCode,
    disconnect,
    checkCode,
  } = useSocket({
    auto: true,
    onMessage: handleMessage,
  });

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      dialogDispatch({
        type: "open",
        payload: {
          id: "connect",
          component: (
            <ConnectDialog
              candidates={candidates}
              host={host}
              connect={connect}
              showCode={showCode}
              checkCode={checkCode}
            />
          ),
          onClose: disconnect,
        },
      });
    }
  }, [
    candidates,
    host,
    showCode,
    connect,
    dialogDispatch,
    disconnect,
    checkCode,
  ]);

  useEffect(() => {
    if (host && code) {
      dialogDispatch({
        type: "close",
        payload: null,
      });
    }
  }, [host, code, dialogDispatch]);

  if (candidates.length === 0 && !host) {
    return (
      <Ariakit.Button onClick={() => find()}>Look for a set</Ariakit.Button>
    );
  }

  return (
    <>
      <p>Remote</p>
      <Outlet />
    </>
  );
};
