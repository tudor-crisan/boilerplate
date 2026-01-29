import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  color = "primary", // primary, secondary, accent, success, warning, error, info
}) {
  const { styling } = useStyling();

  // Determine progress color class based on prop
  const colorClass = color ? `progress-${color}` : "progress-primary";

  return (
    <progress
      className={cn(styling.components.progressBar, colorClass, className)}
      value={value}
      max={max}
    ></progress>
  );
}
