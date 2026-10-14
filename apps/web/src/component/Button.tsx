"use client";

import {
  Button as UntitledButton,
  type ButtonProps as UntitledButtonProps,
} from "@/components/base/buttons/button";

interface ButtonProps {
  label: string;
  onClick?: UntitledButtonProps["onClick"];
}

function Button({ label = "", onClick }: ButtonProps) {
  return (
    <UntitledButton color="secondary" size="md" onClick={onClick}>
      {label}
    </UntitledButton>
  );
}

export default Button;
