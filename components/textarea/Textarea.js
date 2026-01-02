"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Textarea({ className = "", error, showCharacterCount, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  const errorClass = error ? "textarea-error" : "";
  const standardClass = `${styling.roundness[0]} ${styling.shadows[0]} textarea`;

  const content = (
    <textarea
      className={`${standardClass} ${errorClass} ${className} w-full`.trim()}
      {...props}
    />
  );

  if (showCharacterCount && props.maxLength) {
    return (
      <div className="w-full">
        {content}
        <div className="text-[10px] text-base-content/40 text-right mt-1 font-medium">
          {props.value?.length || 0} / {props.maxLength}
        </div>
      </div>
    );
  }

  return content;
}
