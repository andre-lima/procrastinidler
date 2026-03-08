import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps } from "react";

const classes = {
  progressTrack: "progressTrack",
  progressFill: "progressFill",
};

export function ProgressRoot(props: ComponentProps<typeof BaseProgress.Root>) {
  return <BaseProgress.Root {...props} />;
}

export function ProgressTrack({ className = "", ...props }: ComponentProps<typeof BaseProgress.Track>) {
  return <BaseProgress.Track className={`${classes.progressTrack} ${className}`} {...props} />;
}

export function ProgressIndicator({ className = "", ...props }: ComponentProps<typeof BaseProgress.Indicator>) {
  return <BaseProgress.Indicator className={`${classes.progressFill} ${className}`} {...props} />;
}
