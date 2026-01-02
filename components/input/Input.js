"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Input({ className = "", error, showCharacterCount, ...props }) {
  const { styling } = useStyling();

  // Basic defaults for text-like inputs
  // We avoid adding 'input' class to radio/checkbox to prevent styling conflicts
  const isCheckable = props.type === "radio" || props.type === "checkbox";

  let defaultClasses = "";
  if (!isCheckable) {
    // Apply standard input class and global roundness
    defaultClasses = `${styling.components.input} ${styling.general.element} `;
  }

  // Helper for error state
  const errorClass = error ? "input-error" : "";

  if (showCharacterCount && props.maxLength) {
    return (
      <div className="relative w-full">
        <input
          className={`${defaultClasses} ${errorClass} ${className} w-full pr-14`.trim()}
          {...props}
        />
        <div className="absolute p-1 right-2 bottom-2 text-xs text-base-content/40 font-medium pointer-events-none">
          {props.value?.length || 0} / {props.maxLength}
        </div>
      </div>
    );
  }

  return (
    <input
      className={`${defaultClasses} ${errorClass} ${className}`.trim()}
      {...props}
    />
  );
}
