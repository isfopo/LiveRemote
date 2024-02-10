import { useMemo } from "react";
import * as Ariakit from "@ariakit/react";
import { useDialogContext } from "../../context/dialog/useDialogContext";

export const DialogManager = () => {
  const { state, dispatch } = useDialogContext();

  return useMemo(() => {
    return (
      <Ariakit.Dialog
        open={state.activeDialog !== null}
        onClose={() => dispatch({ type: "close", payload: null })}
      >
        {state.activeDialog?.component}
      </Ariakit.Dialog>
    );
  }, [state]);
};
