import { Text } from "tamagui";
import { CodeInputModal } from "../../components/modals/CodeInputModal";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { useSocket } from "../../hooks/useSocket";

export interface ConnectProps {}

export const Connect = ({}: ConnectProps) => {
  const { candidates, loading, connect, connected, showCode, code } = useSocket(
    {
      find: true,
    }
  );

  const { dispatch } = useSocketContext();

  return (
    <>
      <CodeInputModal
        open={connected && !code}
        showCode={showCode}
        onClose={() => dispatch({ type: "disconnect", payload: null })}
      />
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      <CandidateStack candidates={candidates} connect={connect} />
    </>
  );
};
