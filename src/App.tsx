import { useState } from "react";
import { Button, Stack, Text } from "tamagui";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <Stack margin={1}>
      <Text>Vite + Bun + Tamagui</Text>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </Stack>
  );
}

export default App;
