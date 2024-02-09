import { useCallback, useState } from "react";
import { Dialog } from "@ariakit/react";

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
  const [code, setCode] = useState<string>("");

  return (
    <Dialog modal open={open}>
      {/* <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={onClose}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Input Code</Dialog.Title>

          <Dialog.Description>
            Type the code found in your Ableton Live set to connect Live Remote
          </Dialog.Description>

          <Fieldset gap="$4" horizontal>
            <Button onPress={showCode}>Show code</Button>
            <Label display="none" aria-hidden htmlFor="code">
              Code
            </Label>
            <Input flex={2} flexGrow={1} id="code" value={code} />
          </Fieldset>

          <Fieldset horizontal>
            <Button flexGrow={1} onPress={() => checkCode(code)}>
              Connect
            </Button>
          </Fieldset>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                onPress={onClose}
              >
                X
              </Button>
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal> */}
    </Dialog>
  );
};
