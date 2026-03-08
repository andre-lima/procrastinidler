import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import type { ComponentProps, ReactNode } from "react";

const classes = {
  radioRow: "radioRow",
  radioCheck: "radioCheck",
  radioCheckActive: "radioCheckActive",
  radioLabel: "radioLabel",
  radioLabelActive: "radioLabelActive",
};

export function RadioGroupRoot(props: ComponentProps<typeof BaseRadioGroup>) {
  return <BaseRadioGroup {...props} />;
}

export function RadioRoot({
  className = "",
  value,
  selected,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseRadio.Root>, "children"> & { selected?: boolean; children: ReactNode }) {
  return (
    <BaseRadio.Root className={`${classes.radioRow} ${className}`} value={value} {...props}>
      <span className={`${classes.radioCheck} ${selected ? classes.radioCheckActive : ""}`}>
        {selected ? "√" : " "}
      </span>
      <BaseRadio.Indicator keepMounted style={{ display: "none" }} />
      <span className={`${classes.radioLabel} ${selected ? classes.radioLabelActive : ""}`}>{children}</span>
    </BaseRadio.Root>
  );
}
