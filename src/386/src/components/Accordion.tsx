import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";

const classes = {
  accItem: "accItem",
  accTrigger: "accTrigger",
  accArrow: "accArrow",
  accPanel: "accPanel",
};

export function AccordionRoot({
  defaultValue,
  value,
  onValueChange,
  ...props
}: ComponentProps<typeof BaseAccordion.Root>) {
  return <BaseAccordion.Root {...props} defaultValue={defaultValue} value={value} onValueChange={onValueChange} />;
}

export function AccordionItem({ className = "", ...props }: ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item className={`${classes.accItem} ${className}`} {...props} />;
}

export function AccordionHeader(props: ComponentProps<typeof BaseAccordion.Header>) {
  return <BaseAccordion.Header {...props} />;
}

export function AccordionTrigger({ className = "", children, ...props }: ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Trigger className={`${classes.accTrigger} ${className}`} {...props}>
      {children}
      <span className={classes.accArrow}>▾</span>
    </BaseAccordion.Trigger>
  );
}

export function AccordionPanel({ className = "", ...props }: ComponentProps<typeof BaseAccordion.Panel>) {
  return <BaseAccordion.Panel className={`${classes.accPanel} ${className}`} {...props} />;
}
