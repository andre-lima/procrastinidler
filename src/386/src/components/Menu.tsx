import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";

const classes = {
  menuPopup: "menuPopup",
  menuItem: "menuItem",
  menuItemDanger: "menuItemDanger",
  menuSep: "menuSep",
};

export function MenuRoot(props: ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root {...props} />;
}

export function MenuTrigger(props: ComponentProps<typeof BaseMenu.Trigger>) {
  return <BaseMenu.Trigger {...props} />;
}

export function MenuPortal(props: ComponentProps<typeof BaseMenu.Portal>) {
  return <BaseMenu.Portal {...props} />;
}

export function MenuPositioner(props: ComponentProps<typeof BaseMenu.Positioner>) {
  return <BaseMenu.Positioner {...props} />;
}

export function MenuPopup({ className = "", ...props }: ComponentProps<typeof BaseMenu.Popup>) {
  return <BaseMenu.Popup className={`${classes.menuPopup} ${className}`} {...props} />;
}

export function MenuItem({ className = "", danger, ...props }: ComponentProps<typeof BaseMenu.Item> & { danger?: boolean }) {
  return <BaseMenu.Item className={`${classes.menuItem} ${danger ? classes.menuItemDanger : ""} ${className}`} {...props} />;
}
