import * as Ariakit from "@ariakit/react";

export interface CodeInputModalProps {
  open: boolean;
  showCode: () => void;
  checkCode: (code: number) => void;
  onClose: () => void;
}

export const CodeInputModal = ({
  open,
  showCode,
  checkCode,
  onClose,
}: CodeInputModalProps) => {
  return (
    <>
      <Ariakit.DialogHeading className="heading">Success</Ariakit.DialogHeading>
      <p className="description">
        Your payment has been successfully processed. We have emailed your
        receipt.
      </p>
      <div>
        <Ariakit.DialogDismiss className="button">OK</Ariakit.DialogDismiss>
      </div>
    </>
  );
};
