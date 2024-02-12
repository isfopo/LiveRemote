import * as Ariakit from "@ariakit/react";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { Candidate, SocketHost } from "../../context/socket/types";

export interface ConnectDialogProps {
  candidates: Candidate[];
  host: SocketHost | null;
  showCode: () => void;
  connect: (host: Candidate) => void;
}
export const ConnectDialog = ({
  connect,
  candidates,
  showCode,
  host,
}: ConnectDialogProps) => {
  console.log(host);
  return (
    <>
      <p>Connect to your set</p>
      <CandidateStack
        candidates={candidates}
        connect={(host) => connect(host)}
      />
      {host ? (
        <>
          <p>Connected to {host.name}</p>
          <Ariakit.Button onClick={showCode}>Show Code</Ariakit.Button>
        </>
      ) : null}
    </>
  );
};
