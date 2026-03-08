import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";

const classes = {
  tooltipPopup: "tooltipPopup",
};

export function TooltipProvider(props: ComponentProps<typeof BaseTooltip.Provider>) {
  return <BaseTooltip.Provider {...props} />;
}

export function TooltipRoot(props: ComponentProps<typeof BaseTooltip.Root>) {
  return <BaseTooltip.Root {...props} />;
}

export function TooltipTrigger(props: ComponentProps<typeof BaseTooltip.Trigger>) {
  return <BaseTooltip.Trigger {...props} />;
}

export function TooltipPortal(props: ComponentProps<typeof BaseTooltip.Portal>) {
  return <BaseTooltip.Portal {...props} />;
}

export function TooltipPositioner(props: ComponentProps<typeof BaseTooltip.Positioner>) {
  return <BaseTooltip.Positioner {...props} />;
}

export function TooltipPopup({ className = "", ...props }: ComponentProps<typeof BaseTooltip.Popup>) {
  return <BaseTooltip.Popup className={`${classes.tooltipPopup} ${className}`} {...props} />;
}
