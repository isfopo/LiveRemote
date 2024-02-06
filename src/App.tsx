import { Button, Text } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";
import { useAppSelector } from "./hooks/useAppSelector";

function App() {
  const { candidates, loading, connect, connected } = useSocket();
  const { host } = useAppSelector((state) => state.socket);

  return (
    <>
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      {candidates.map((c) => (
        <Button onPress={() => connect(c)}>{c.name}</Button>
      ))}
      <Text>{connected && `connected to ${host?.name}`}</Text>
    </>
  );
}

export default App;
