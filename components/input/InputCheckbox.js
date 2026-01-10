"use client";
import { useStyling } from "@/context/ContextStyling";

export default function InputCheckbox({
  label,
  value,
  onChange,
  className = "",
  disabled,
  ...props
}) {
  const { styling } = useStyling();

  return (
    <div className={`flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <label className={`flex items-center gap-2 cursor-pointer touch-action-manipulation w-full h-full ${disabled ? "cursor-not-allowed" : ""}`}>
        <input
          type="checkbox"
          className={`${styling.components.element} checkbox checkbox-primary`}
          checked={value}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        {label && <span className="text-sm flex-1">{label}</span>}
      </label>
    </div>
  );
}
