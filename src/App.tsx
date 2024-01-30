import { useState } from "react";
import { Button, Stack, Text } from "tamagui";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <Text>Vite + Tamagui</Text>
      <Button onPress={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </>
  );
}

export default App;
