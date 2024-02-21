import * as Ariakit from "@ariakit/react";
import { useFormStore } from "@ariakit/react";
import { CandidateStack } from "../../components/stacks/CandidateStack";
import { Candidate, SocketHost } from "../../types/socket";

export interface CodeInputForm {
  code: number | null;
}

export interface ConnectDialogProps {
  candidates: Candidate[];
  host: SocketHost | null;
  showCode: () => void;
  connect: (host: Candidate) => void;
  checkCode: (input: number) => void;
}

export const ConnectDialog = ({
  candidates,
  host,
  connect,
  showCode,
  checkCode,
}: ConnectDialogProps) => {
  const form = useFormStore<CodeInputForm>({
    defaultValues: { code: null },
  });

  form.useSubmit(() => {
    const { code } = form.getState().values;
    if (code) {
      checkCode(code);
    }
  });

  if (!host) {
    return (
      <>
        <p>Connect to your set</p>
        <CandidateStack
          candidates={candidates}
          connect={(host) => connect(host)}
        />
      </>
    );
  }

  return (
    <Ariakit.Form store={form}>
      <p>Connected to {host.name}</p>
      <Ariakit.Button onClick={showCode}>Show Code</Ariakit.Button>
      <Ariakit.FormInput
        name={form.names.code}
        placeholder="Code"
        required={true}
        className="input"
        type="number"
        min={0}
        max={9999}
      />
      <Ariakit.FormError name={form.names.code} />
      <Ariakit.FormSubmit>Check</Ariakit.FormSubmit>
    </Ariakit.Form>
  );
};
