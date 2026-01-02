"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Select({ className = "", error, children, options, placeholder, value, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  const errorClass = error ? "select-error" : "";
  const standardClass = `${styling.components.element} select`;

  return (
    <select
      className={`${standardClass} ${errorClass} ${className}`.trim()}
      value={value}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options
        ? options.map((opt) => {
          const label = typeof opt === "object" ? opt.label : opt;
          const val = typeof opt === "object" ? opt.value : opt;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })
        : children}
    </select>
  );
}
