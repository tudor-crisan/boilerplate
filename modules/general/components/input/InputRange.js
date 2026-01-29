"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

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
  const { styling } = useStyling();
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
      className={cn(styling.components.range, colorClass, className)}
      {...props}
    />
  );
};

export default InputRange;
