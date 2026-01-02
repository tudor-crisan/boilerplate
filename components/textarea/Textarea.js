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
          className={`${standardClass} ${errorClass} ${className} w-full pb-6`.trim()}
          {...props}
        />
        <div className="absolute right-3 bottom-1.5 text-[10px] text-base-content/40 font-medium pointer-events-none">
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
