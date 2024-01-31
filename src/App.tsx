import { Text } from "tamagui";
import { useSocket } from "./hooks/useSocket";
import "./App.css";

function App() {
  const { candidates, loading } = useSocket();

  return (
    <>
      <Text>LiveRemote</Text>
      <Text>{loading ? "searching" : ""}</Text>
      {candidates.map((c) => (
        <Text>{c.hostName}</Text>
      ))}
    </>
  );
}

export default App;
