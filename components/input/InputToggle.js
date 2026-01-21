"use client";

import { useStyling } from "@/context/ContextStyling";

export default function InputToggle({
  label,
  value,
  onChange,
  className = "",
  disabled,
  size = "toggle-xs",
  ...props
}) {
  const { styling } = useStyling();

  // Note: DaisyUI toggle is a checkbox input
  return (
    <div className={`form-control ${className}`}>
      <label
        className={`label cursor-pointer gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {label && (
          <span className="label-text text-xs uppercase font-bold opacity-50">
            {label}
          </span>
        )}
        <input
          type="checkbox"
          className={`${styling?.components?.element || ""} toggle ${size}`}
          checked={value}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          {...props}
        />
      </label>
    </div>
  );
}
