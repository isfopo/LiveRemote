import { Provider } from "react-redux";
import { useState } from "react";
import { Button, Stack, Text } from "tamagui";
import "./App.css";
import store from "./store/store";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <Provider store={store}>
      <Stack margin={1}>
        <Text>Vite + Tamagui</Text>
        <Button onPress={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </Stack>
    </Provider>
  );
}

export default App;
