"use client";
import { useStyling } from "@/context/ContextStyling";

export default function InputButton({ options, value, onChange, className = "", disabled }) {
  const { styling } = useStyling();

  return (
    <div className={`flex gap-2 ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {options.map((opt) => {
        const optValue = typeof opt === "object" ? opt.value : opt;
        const optLabel = typeof opt === "object" ? opt.label : opt;
        const isActive = value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(optValue)}
            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"} ${styling.components.element}`}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
