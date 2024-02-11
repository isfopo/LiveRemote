import { useSocketContext } from "../../context/socket/useSocketContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDialogContext } from "../../context/dialog/useDialogContext";
import { ConnectDialog } from "../../components/dialogs/ConnectDialog";

export const Remote = () => {
  const {
    state: { host, candidates },
    dispatch: socketDispatch,
  } = useSocketContext();

  const { dispatch: dialogDispatch } = useDialogContext();

  useEffect(() => {
    if (!host) {
      socketDispatch({ type: "find", payload: {} });
    }
  }, []);

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
  });

  return (
    <>
      <p>hi</p>
      <Outlet />
    </>
  );
};
