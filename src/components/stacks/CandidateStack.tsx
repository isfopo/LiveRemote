import { SocketHost } from "../../context/socket/types";
import { Button } from "../buttons/Button";

export interface CandidateStackProps {
  connect: (host: SocketHost) => void;
  candidates: SocketHost[];
}

export const CandidateStack = ({
  candidates,
  connect,
}: CandidateStackProps) => {
  return (
    <>
      {candidates.map((candidate) => (
        <Button key={candidate.url} onClick={() => connect(candidate)}>
          {candidate.name}
        </Button>
      ))}
    </>
  );
};
