import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

const classes = {
  tabList: "tabList",
  tab: "tab",
  tabActive: "tabActive",
  tabPanel: "tabPanel",
};

export function TabsRoot(props: ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root {...props} />;
}

export function TabsList({ className = "", ...props }: ComponentProps<typeof BaseTabs.List>) {
  return <BaseTabs.List className={`${classes.tabList} ${className}`} {...props} />;
}

export function TabsTab({
  className = "",
  value,
  active,
  ...props
}: ComponentProps<typeof BaseTabs.Tab> & { active?: boolean }) {
  return (
    <BaseTabs.Tab
      className={`${active ? classes.tabActive : classes.tab} ${className}`}
      value={value}
      {...props}
    />
  );
}

export function TabsPanel({ className = "", ...props }: ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={`${classes.tabPanel} ${className}`} {...props} />;
}
