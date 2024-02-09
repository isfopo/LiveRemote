import * as Ariakit from "@ariakit/react";

export const Button = (props: Ariakit.ButtonProps) => {
  return <Ariakit.Button {...props}>{props.children}</Ariakit.Button>;
};
