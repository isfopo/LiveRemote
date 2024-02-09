import { CodeInputModal } from "../../components/modals/CodeInputModal";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { useSocket } from "../../hooks/useSocket";

export const Connect = () => {
  const { candidates, loading, connect, connected, showCode, code, checkCode } =
    useSocket({
      find: true,
    });

  const { dispatch } = useSocketContext();

  return (
    <>
      <CodeInputModal
        open={connected && !code}
        showCode={showCode}
        checkCode={checkCode}
        onClose={() => dispatch({ type: "disconnect", payload: null })}
      />
      <p>LiveRemote</p>
      <p>{loading ? "searching" : ""}</p>
      <CandidateStack candidates={candidates} connect={connect} />
    </>
  );
};
