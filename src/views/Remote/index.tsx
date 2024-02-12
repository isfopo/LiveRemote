import * as Ariakit from "@ariakit/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { useSocket } from "../../hooks/useSocket";

export const Remote = () => {
  const { dispatch: dialogDispatch } = useDialogContext();

  const { find, connect, candidates, host, showCode, disconnect } = useSocket({
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
          onClose: disconnect,
        },
      });
    }
  }, [candidates, host, showCode, connect]);

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
