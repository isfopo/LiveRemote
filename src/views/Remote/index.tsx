import * as Ariakit from "@ariakit/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { useSocket } from "../../hooks/useSocket";

export const Remote = () => {
  const { dispatch: socketDispatch } = useSocketContext();

  const { dispatch: dialogDispatch } = useDialogContext();

  const { find, connect, candidates, host, showCode } = useSocket({
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
            />
          ),
          onClose: () => socketDispatch({ type: "reset", payload: null }),
        },
      });
    }
  }, [candidates, host]);

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
