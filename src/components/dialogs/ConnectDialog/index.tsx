import * as Ariakit from "@ariakit/react";
import { useFormStore } from "@ariakit/react";
import { Candidate, SocketHost } from "../../../types/socket";
import { CandidateStack } from "../../stacks/CandidateStack";
import styles from "./index.module.scss";

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
    <Ariakit.Form store={form} className={styles.form}>
      <p>
        Connected to <strong>{host.name}</strong>
      </p>
      <span>
        <Ariakit.Button className="button" onClick={showCode}>
          Show Code
        </Ariakit.Button>
        <Ariakit.FormInput
          className="input"
          name={form.names.code}
          placeholder="Code"
          required
        />
      </span>
      {/* <Ariakit.FormError name={form.names.code} /> */}
      <Ariakit.FormSubmit>Check</Ariakit.FormSubmit>
    </Ariakit.Form>
  );
};
