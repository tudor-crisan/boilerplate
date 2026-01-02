"use client";
import { useStyling } from "@/context/ContextStyling";
import CharacterCount from "@/components/common/CharacterCount";

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
        <CharacterCount
          currentLength={props.value?.length || 0}
          maxLength={props.maxLength}
          className="bottom-px"
        />
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
