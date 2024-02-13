import * as Ariakit from "@ariakit/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { useSocket } from "../../hooks/useSocket";

export const Remote = () => {
  const { dispatch: dialogDispatch } = useDialogContext();

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
  });

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      dialogDispatch({
        type: "open",
        payload: {
          id: "connect",
          component: (
            <ConnectDialog
              connect={connect}
              candidates={candidates}
              host={host}
              showCode={showCode}
              checkCode={checkCode}
            />
          ),
          onClose: disconnect,
        },
      });
    }
  }, [candidates, host, showCode, connect]);

  useEffect(() => {
    if (host && code) {
      dialogDispatch({
        type: "close",
        payload: null,
      });
    }
  }, [host, code]);

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
