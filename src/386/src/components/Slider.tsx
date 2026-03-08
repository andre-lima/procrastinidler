import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentProps } from "react";

const classes = {
  sliderRoot: "sliderRoot",
  sliderControl: "sliderControl",
  sliderTrack: "sliderTrack",
  sliderFill: "sliderFill",
  sliderThumb: "sliderThumb",
};

export function SliderRoot({ className = "", ...props }: ComponentProps<typeof BaseSlider.Root>) {
  return <BaseSlider.Root className={`${classes.sliderRoot} ${className}`} {...props} />;
}

export function SliderControl({ className = "", ...props }: ComponentProps<typeof BaseSlider.Control>) {
  return <BaseSlider.Control className={`${classes.sliderControl} ${className}`} {...props} />;
}

export function SliderTrack({ className = "", ...props }: ComponentProps<typeof BaseSlider.Track>) {
  return <BaseSlider.Track className={`${classes.sliderTrack} ${className}`} {...props} />;
}

export function SliderIndicator({ className = "", ...props }: ComponentProps<typeof BaseSlider.Indicator>) {
  return <BaseSlider.Indicator className={`${classes.sliderFill} ${className}`} {...props} />;
}

export function SliderThumb({ className = "", ...props }: ComponentProps<typeof BaseSlider.Thumb>) {
  return <BaseSlider.Thumb className={`${classes.sliderThumb} ${className}`} {...props} />;
}
