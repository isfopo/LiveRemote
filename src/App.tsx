import { Button, Text } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";
import { useAppSelector } from "./hooks/useAppSelector";
import { ModalManager } from "./components/modals/ModalManager";

function App() {
  const { candidates, loading, connect, connected, showCode } = useSocket();
  const { host } = useAppSelector((state) => state.socket);

  return (
    <>
      <ModalManager />
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      {candidates.map((c) => (
        <Button onPress={() => connect(c)}>{c.name}</Button>
      ))}
      <>
        {connected && (
          <>
            <Text>{host?.name}</Text>
            <Button onPress={showCode}>Show</Button>
          </>
        )}
      </>
    </>
  );
}

export default App;
