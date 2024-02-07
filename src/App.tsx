import { Text, YStack } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";
import { CodeInputModal } from "./components/modals/CodeInputModal";
import { CandidateStack } from "./components/stacks/CandidateStack";
import { useSocketContext } from "./context/socket/useSocketContext";

function App() {
  const { candidates, loading, connect, connected, showCode, code } = useSocket(
    {
      find: true,
    }
  );

  const { dispatch } = useSocketContext();

  return (
    <YStack>
      <CodeInputModal
        open={connected && !code}
        showCode={showCode}
        onClose={() => dispatch({ type: "disconnect", payload: null })}
      />
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      <CandidateStack candidates={candidates} connect={connect} />
    </YStack>
  );
}

export default App;
