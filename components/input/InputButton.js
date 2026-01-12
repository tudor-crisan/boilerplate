"use client";
import { useStyling } from "@/context/ContextStyling";

export default function InputButton({ options, value, onChange, className = "" }) {
  const { styling } = useStyling();

  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((opt) => {
        const optValue = typeof opt === "object" ? opt.value : opt;
        const optLabel = typeof opt === "object" ? opt.label : opt;
        const isActive = value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange(optValue)}
            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"} ${styling.components.element}`}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
