"use client";
import { cn } from "@/libs/utils.client";

const InputRange = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
  color = "primary", // primary, secondary, accent, etc.
  ariaLabel,
  ...props
}) => {
  // Map color prop to DaisyUI classes
  const colorClass =
    {
      primary: "range-primary",
      secondary: "range-secondary",
      accent: "range-accent",
      success: "range-success",
      warning: "range-warning",
      error: "range-error",
      info: "range-info",
    }[color] || "range-primary";

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      step={step}
      onChange={onChange}
      aria-labelledby={ariaLabel}
      className={cn("range range-xs", colorClass, className)}
      {...props}
    />
  );
};

export default InputRange;
