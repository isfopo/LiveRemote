import * as Ariakit from "@ariakit/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { useFindCandidates } from "../../hooks/useFindCandidates";

export const Remote = () => {
  const {
    state: { host, candidates },
    dispatch: socketDispatch,
  } = useSocketContext();

  const { dispatch: dialogDispatch } = useDialogContext();

  const { find } = useFindCandidates();

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      dialogDispatch({
        type: "open",
        payload: {
          id: "connect",
          component: <ConnectDialog />,
        },
      });
    }
  }, [candidates]);

  if (candidates.length === 0 && !host) {
    return (
      <Ariakit.Button onClick={() => find()}>Look for a set</Ariakit.Button>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};
