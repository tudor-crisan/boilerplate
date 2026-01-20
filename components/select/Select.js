"use client";
import SvgChevronLeft from "@/components/svg/SvgChevronLeft";
import SvgChevronRight from "@/components/svg/SvgChevronRight";
import { useStyling } from "@/context/ContextStyling";

export default function Select({ className = "", error, children, options, placeholder, value, withNavigation = false, rounded = false, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  const errorClass = error ? "select-error" : "";
  const roundedClass = rounded ? "rounded-md" : "";
  const standardClass = `${styling.components.select} ${styling.general.element} ${roundedClass}`;

  // Navigation Logic
  let navigationControls = null;
  let wrapperClass = "";

  if (withNavigation && options?.length > 0) {
    wrapperClass = `${styling.flex.col} gap-2`;

    // Normalize options/values for index calculation
    const normalizedOptions = options.map(opt => {
      if (typeof opt === 'object') return opt;
      return { label: opt, value: opt };
    });

    const currentIndex = normalizedOptions.findIndex(opt => opt.value === value);
    const total = normalizedOptions.length;

    // 1-based index for display, handle -1 if not found (e.g. placeholder)
    const displayIndex = currentIndex === -1 ? 0 : currentIndex + 1;

    const handleStep = (direction) => {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < total) {
        const newOption = normalizedOptions[newIndex];
        // Simulate event for parent onChange
        if (props.onChange) {
          props.onChange({
            target: {
              name: props.name,
              value: newOption.value
            }
          });
        }
      }
    };

    // Icons
    const IconPrev = <SvgChevronLeft className="w-5 h-5" />;
    const IconNext = <SvgChevronRight className="w-5 h-5" />;

    navigationControls = (
      <div className={`${styling.flex.between} gap-2 mb-1`}>
        <div className="text-xs opacity-70 font-medium">
          {currentIndex !== -1 ? `${displayIndex} / ${total}` : `0 / ${total}`}
        </div>
        <div className={`${styling.flex.items_center} gap-1`}>
          <button
            type="button"
            className="btn btn-sm btn-square btn-ghost hover:bg-base-200"
            onClick={() => handleStep(-1)}
            disabled={props.disabled || currentIndex <= 0}
          >
            {IconPrev}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-square btn-ghost hover:bg-base-200"
            onClick={() => handleStep(1)}
            disabled={props.disabled || currentIndex === -1 || currentIndex >= total - 1}
          >
            {IconNext}
          </button>
        </div>
      </div>
    );
  }

  const selectElement = (
    <select
      className={`${standardClass} ${errorClass} ${className}`.trim()}
      value={value}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options
        ? options.map((opt) => {
          const label = typeof opt === "object" ? opt.label : opt;
          const val = typeof opt === "object" ? opt.value : opt;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })
        : children}
    </select>
  );

  if (withNavigation) {
    return (
      <div className={wrapperClass}>
        {navigationControls}
        {selectElement}
      </div>
    );
  }

  return selectElement;
}
