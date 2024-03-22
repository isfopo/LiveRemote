import * as Ariakit from "@ariakit/react";
import { useMemo } from "react";
import { useDialogContext } from "../../../context/dialog/useDialogContext";
import styles from "./index.module.scss";

export const DialogManager = () => {
  const { state, dispatch } = useDialogContext();

  const handleClose = () => {
    state.activeDialog?.onClose?.();
    dispatch({ type: "close", payload: null });
  };

  return useMemo(() => {
    return (
      <Ariakit.Dialog
        className={styles.dialog}
        open={state.activeDialog !== null}
        onClose={handleClose}
        backdrop={<div className={styles.backdrop} />}
      >
        <Ariakit.DialogHeading className={styles.heading}>
          {state.activeDialog?.title}
        </Ariakit.DialogHeading>

        <Ariakit.DialogDismiss className={styles.dismiss} />
        {state.activeDialog?.component}
      </Ariakit.Dialog>
    );
  }, [state, handleClose]);
};
