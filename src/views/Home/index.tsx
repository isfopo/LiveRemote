import { Button } from "../../components/buttons/Button";

export const Home = () => {
  const toRemote = () => {
    window.location.href = "/remote";
  };

  return <Button onClick={toRemote}>Remote</Button>;
};
