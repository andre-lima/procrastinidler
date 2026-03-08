import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";

const classes = {
  numberRoot: "numberRoot",
  numberBtn: "numberBtn",
  numberBtnRight: "numberBtnRight",
  numberInput: "numberInput",
};

export function NumberFieldRoot(props: ComponentProps<typeof BaseNumberField.Root>) {
  return <BaseNumberField.Root {...props} />;
}

export function NumberFieldGroup({ className = "", ...props }: ComponentProps<typeof BaseNumberField.Group>) {
  return <BaseNumberField.Group className={`${classes.numberRoot} ${className}`} {...props} />;
}

export function NumberFieldDecrement({ className = "", ...props }: ComponentProps<typeof BaseNumberField.Decrement>) {
  return <BaseNumberField.Decrement className={`${classes.numberBtn} ${className}`} {...props} />;
}

export function NumberFieldInput({ className = "", ...props }: ComponentProps<typeof BaseNumberField.Input>) {
  return <BaseNumberField.Input className={`${classes.numberInput} ${className}`} {...props} />;
}

export function NumberFieldIncrement({ className = "", ...props }: ComponentProps<typeof BaseNumberField.Increment>) {
  return <BaseNumberField.Increment className={`${classes.numberBtn} ${classes.numberBtnRight} ${className}`} {...props} />;
}
