import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ComponentProps } from "react";

const classes = {
  separator: "separator",
};

export function Separator({ className = "", ...props }: ComponentProps<typeof BaseSeparator>) {
  return <BaseSeparator className={`${classes.separator} ${className}`} {...props} />;
}
