import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

const classes = {
  switchRoot: "switchRoot",
  switchRootOn: "switchRootOn",
  switchThumb: "switchThumb",
  switchThumbOn: "switchThumbOn",
  switchLabel: "switchLabel",
};

export function SwitchRoot({
  className = "",
  checked,
  onCheckedChange,
  ...props
}: ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={`${classes.switchRoot} ${checked ? classes.switchRootOn : ""} ${className}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    />
  );
}

export function SwitchThumb({
  className = "",
  checked,
  children,
  ...props
}: ComponentProps<typeof BaseSwitch.Thumb> & { checked?: boolean; children?: React.ReactNode }) {
  return (
    <BaseSwitch.Thumb className={`${classes.switchThumb} ${checked ? classes.switchThumbOn : ""} ${className}`} {...props}>
      {children}
    </BaseSwitch.Thumb>
  );
}

export function Switch({
  label,
  checked,
  onCheckedChange,
  onLabel = "ON",
  offLabel = "",
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <label className={classes.switchLabel}>
      <SwitchRoot checked={checked} onCheckedChange={onCheckedChange}>
        <SwitchThumb checked={checked}>{checked ? onLabel : offLabel}</SwitchThumb>
      </SwitchRoot>
      {label}
    </label>
  );
}
