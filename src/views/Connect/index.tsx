import { useDialogContext } from "../../context/dialog/useDialogContext";
import { CodeInputModal } from "../../components/dialogs/CodeInputModal";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { useSocket } from "../../hooks/useSocket";

export const Connect = () => {
  const { dispatch: dialogDispatch } = useDialogContext();

  const { candidates, loading, connect, connected, showCode, code, checkCode } =
    useSocket({
      find: true,
      onConnect: () =>
        dialogDispatch({
          type: "open",
          payload: {
            id: "code-input",
            component: (
              <CodeInputModal
                open={true}
                showCode={showCode}
                checkCode={checkCode}
                onClose={() => dialogDispatch({ type: "close", payload: null })}
              />
            ),
          },
        }),
    });

  const { dispatch: socketDispatch } = useSocketContext();

  return (
    <>
      <p>LiveRemote</p>
      <p>{loading ? "searching" : ""}</p>
      <CandidateStack candidates={candidates} connect={connect} />
    </>
  );
};
