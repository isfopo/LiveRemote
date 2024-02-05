import { Button, Text } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";

function App() {
  const { candidates, loading, connect, connected } = useSocket();

  return (
    <>
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      {candidates.map((c) => (
        <Button onPress={() => connect(c)}>{c.name}</Button>
      ))}
    </>
  );
}

export default App;
