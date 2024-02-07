import { Text, YStack } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";
import { CodeInputModal } from "./components/modals/CodeInputModal";
import { CandidateStack } from "./components/stacks/CandidateStack";

function App() {
  const { candidates, loading, connect, connected, showCode, code } = useSocket(
    {
      find: true,
    }
  );

  return (
    <YStack>
      <CodeInputModal open={connected && !code} showCode={showCode} />
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      <CandidateStack candidates={candidates} connect={connect} />
    </YStack>
  );
}

export default App;
