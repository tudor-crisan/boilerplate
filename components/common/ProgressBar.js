"use client";

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  color = "primary", // primary, secondary, accent, success, warning, error, info
}) {
  // Determine progress color class based on prop
  const colorClass = color ? `progress-${color}` : "progress-primary";

  return (
    <progress
      className={`progress ${colorClass} w-full ${className}`}
      value={value}
      max={max}
    ></progress>
  );
}
