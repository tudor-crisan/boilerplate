"use client";
import { useStyling } from "@/context/ContextStyling";
import CharacterCount from "@/components/common/CharacterCount";
import SvgClose from "@/components/svg/SvgClose";

export default function Input({ className = "", error, showCharacterCount, icon, allowClear, onClear, ...props }) {
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

  // Clear button logic
  const handleClear = (e) => {
    e.preventDefault();
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: ""
        }
      });
    } else if (onClear) {
      onClear();
    }
  };

  const ClearButton = (allowClear && props.value) ? (
    <button
      type="button"
      onClick={handleClear}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content cursor-pointer"
    >
      <SvgClose />
    </button>
  ) : null;

  if (showCharacterCount && props.maxLength) {
    const maxDigits = props.maxLength.toString().length;
    // Estimate width: (digits + " / " + digits) * char_width + right_offset + extra_padding
    // Using 9px per char for text-xs to be safe, plus 16px base padding
    const paddingRight = (maxDigits * 2 + 3) * 9;

    return (
      <div className="relative w-full">
        <input
          className={`${defaultClasses} ${errorClass} ${className} ${icon ? '!pl-11' : ''}`.trim()}
          style={{ paddingRight: `${paddingRight}px` }}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
            {icon}
          </div>
        )}
        {ClearButton}
        <CharacterCount
          currentLength={props.value?.length || 0}
          maxLength={props.maxLength}
          className="bottom-2"
        />
      </div>
    );
  }

  if (icon || allowClear) {
    return (
      <div className="relative w-full">
        <input
          className={`${defaultClasses} ${errorClass} ${className} ${icon ? 'pl-11!' : ''} ${allowClear ? 'pr-10' : ''}`.trim()}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
            {icon}
          </div>
        )}
        {ClearButton}
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
