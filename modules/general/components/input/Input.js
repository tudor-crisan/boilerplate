"use client";
import CharacterCount from "@/modules/general/components/common/CharacterCount";
import SvgClose from "@/modules/general/components/svg/SvgClose";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

export default function Input({
  className = "",
  error,
  showCharacterCount,
  icon,
  allowClear,
  onClear,
  ...props
}) {
  const { styling } = useStyling();

  const isCheckable = props.type === "radio" || props.type === "checkbox";

  const defaultClasses = !isCheckable
    ? cn(styling.components.input, styling.general.element)
    : "";

  const errorClass = error ? "input-error" : "";

  const handleClear = (e) => {
    e.preventDefault();
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: "",
        },
      });
    } else if (onClear) {
      onClear();
    }
  };

  const ClearButton =
    allowClear && props.value ? (
      <button
        type="button"
        onClick={handleClear}
        className={`absolute inset-y-0 right-0 pr-3 ${styling.flex.items_center} text-base-content/50 hover:text-base-content cursor-pointer`}
      >
        <SvgClose />
      </button>
    ) : null;

  const inputClasses = cn(
    defaultClasses,
    errorClass,
    icon && "pl-11!",
    allowClear && "pr-10",
    className,
  );

  const inputElement = (
    <input
      className={inputClasses}
      {...props}
      style={
        showCharacterCount && props.maxLength
          ? {
              paddingRight: `${(props.maxLength.toString().length * 2 + 3) * 9}px`,
            }
          : props.style
      }
    />
  );

  if (icon || allowClear || showCharacterCount) {
    return (
      <div className="relative w-full">
        {inputElement}
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 ${styling.flex.items_center} pointer-events-none text-base-content/50`}
          >
            {icon}
          </div>
        )}
        {ClearButton}
        {showCharacterCount && props.maxLength && (
          <CharacterCount
            currentLength={props.value?.length || 0}
            maxLength={props.maxLength}
            className="bottom-2"
          />
        )}
      </div>
    );
  }

  return inputElement;
}
