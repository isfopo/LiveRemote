import { useEffect } from "react";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { Candidate } from "../../context/socket/types";
import { useSocketContext } from "../../context/socket/useSocketContext";

export interface ConnectDialogProps {
  connect: (host: Candidate) => void;
}
export const ConnectDialog = ({ connect }: ConnectDialogProps) => {
  const {
    state: { candidates, host },
    dispatch,
  } = useSocketContext();

  useEffect(() => {
    if (host) {
      console.log(host.socket.readyState);
      // host.socket.send(
      //   JSON.stringify({
      //     method: Method.AUTH,
      //     address: "/code",
      //     prop: "show",
      //   })
      // );
    }
  }, [host?.socket.readyState]);

  return (
    <>
      <p>Connect to your set</p>
      <CandidateStack
        candidates={candidates}
        connect={(host) => connect(host)}
      />
      {host ? <p>Connected to {host.name}</p> : null}
    </>
  );
};
