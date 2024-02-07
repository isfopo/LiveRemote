import { Button, Dialog, Fieldset, Input, Label, Unspaced } from "tamagui";

export interface CodeInputModalProps {
  open: boolean;
  showCode: () => void;
}

export const CodeInputModal = ({ open }: CodeInputModalProps) => {
  return (
    <Dialog modal open={open}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
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
            <Label display="none" aria-hidden htmlFor="code">
              Code
            </Label>
            <Input flex={2} flexGrow={1} id="code" />
          </Fieldset>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
              >
                X
              </Button>
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
