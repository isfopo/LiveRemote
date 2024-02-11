import { CandidateStack } from "../../components/stacks/CandidateStack";
import { useSocketContext } from "../../context/socket/useSocketContext";

export const ConnectDialog = () => {
  const {
    state: { candidates },
    dispatch,
  } = useSocketContext();

  return (
    <>
      <p>Connect to your set</p>
      <CandidateStack
        candidates={candidates}
        connect={(host) => dispatch({ type: "connect", payload: host })}
      />
    </>
  );
};
