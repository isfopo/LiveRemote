import { useEffect, useState } from "react";
import { Button, Text } from "tamagui";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppDispatch } from "./store/store";
import { findSocket } from "./store/socket/slice";
import { RootState } from "./store/reducers";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const { candidates } = useSelector((state: RootState) => state.socket);

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    dispatch(findSocket({ port: 9001 }));
  }, []);

  return (
    <>
      <Text>Vite + Tamagui</Text>
      {candidates.map((c) => (
        <Text>{c.url}</Text>
      ))}
    </>
  );
}

export default App;
