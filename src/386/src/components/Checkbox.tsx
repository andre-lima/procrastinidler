import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";

const classes = {
  checkRoot: "checkRoot",
  checkIndicator: "checkIndicator",
  checkLabel: "checkLabel",
};

export function CheckboxRoot({ className = "", ...props }: ComponentProps<typeof BaseCheckbox.Root>) {
  return <BaseCheckbox.Root className={`${classes.checkRoot} ${className}`} {...props} />;
}

export function CheckboxIndicator({ className = "", ...props }: ComponentProps<typeof BaseCheckbox.Indicator>) {
  return <BaseCheckbox.Indicator className={`${classes.checkIndicator} ${className}`} {...props} />;
}

export function Checkbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className={classes.checkLabel}>
      <CheckboxRoot checked={checked} onCheckedChange={onCheckedChange}>
        <CheckboxIndicator>X</CheckboxIndicator>
      </CheckboxRoot>
      {label}
    </label>
  );
}
