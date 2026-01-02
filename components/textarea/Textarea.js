"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Textarea({ className = "", error, showCharacterCount, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  // Helper for error state
  const errorClass = error ? "textarea-error" : "";
  const standardClass = `${styling.components.textarea} ${styling.general.element} `;

  if (showCharacterCount && props.maxLength) {
    return (
      <div className="relative w-full">
        <textarea
          className={`${standardClass} ${errorClass} ${className} w-full pb-12`.trim()}
          {...props}
        />
        <div className="absolute p-1 right-2 bottom-px text-xs text-base-content/40 font-medium pointer-events-none">
          {props.value?.length || 0} / {props.maxLength}
        </div>
      </div>
    );
  }

  return (
    <textarea
      className={`${standardClass} ${errorClass} ${className}`.trim()}
      {...props}
    />
  );
}
