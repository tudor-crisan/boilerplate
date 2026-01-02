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
    defaultClasses = `${styling.roundness[0]} ${styling.shadows[0]} input `;
  }

  // Helper for error state
  const errorClass = error ? "input-error" : "";

  const content = (
    <input
      className={`${defaultClasses} ${errorClass} ${className} w-full`.trim()}
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
