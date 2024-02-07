import { Button, YStack } from "tamagui";
import { SocketHost } from "../../store/socket/types";

export interface CandidateStackProps {
  connect: (host: SocketHost) => void;
  candidates: SocketHost[];
}

export const CandidateStack = ({
  candidates,
  connect,
}: CandidateStackProps) => {
  return (
    <YStack gap={1}>
      {candidates.map((candidate) => (
        <Button key={candidate.url} onPress={() => connect(candidate)}>
          {candidate.name}
        </Button>
      ))}
    </YStack>
  );
};
