"use client";
import { useStyling } from "@/context/ContextStyling";
import CharacterCount from "@/components/common/CharacterCount";

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
    const maxDigits = props.maxLength.toString().length;
    // Estimate width: (digits + " / " + digits) * char_width + right_offset + extra_padding
    // Using 9px per char for text-xs to be safe, plus 16px base padding
    const paddingRight = (maxDigits * 2 + 3) * 9;

    return (
      <div className="relative w-full">
        <input
          className={`${defaultClasses} ${errorClass} ${className}`.trim()}
          style={{ paddingRight: `${paddingRight}px` }}
          {...props}
        />
        <CharacterCount
          currentLength={props.value?.length || 0}
          maxLength={props.maxLength}
          className="bottom-2"
        />
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
