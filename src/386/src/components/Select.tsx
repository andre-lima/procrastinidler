import { Select as BaseSelect } from "@base-ui/react/select";
import type { ComponentProps } from "react";

const classes = {
  selectTrigger: "selectTrigger",
  selectPopup: "selectPopup",
  selectOption: "selectOption",
};

export function SelectRoot(props: ComponentProps<typeof BaseSelect.Root>) {
  return <BaseSelect.Root {...props} />;
}

export function SelectTrigger({ className = "", children, ...props }: ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger className={`${classes.selectTrigger} ${className}`} {...props}>
      {children}
    </BaseSelect.Trigger>
  );
}

export function SelectValue(props: ComponentProps<typeof BaseSelect.Value>) {
  return <BaseSelect.Value {...props} />;
}

export function SelectPortal(props: ComponentProps<typeof BaseSelect.Portal>) {
  return <BaseSelect.Portal {...props} />;
}

export function SelectPositioner(props: ComponentProps<typeof BaseSelect.Positioner>) {
  return <BaseSelect.Positioner {...props} />;
}

export function SelectPopup({ className = "", ...props }: ComponentProps<typeof BaseSelect.Popup>) {
  return <BaseSelect.Popup className={`${classes.selectPopup} ${className}`} {...props} />;
}

export function SelectList(props: ComponentProps<typeof BaseSelect.List>) {
  return <BaseSelect.List {...props} />;
}

export function SelectItem({ className = "", ...props }: ComponentProps<typeof BaseSelect.Item>) {
  return <BaseSelect.Item className={`${classes.selectOption} ${className}`} {...props} />;
}
