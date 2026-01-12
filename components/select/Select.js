"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Select({ className = "", error, children, options, placeholder, value, withNavigation = false, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  const errorClass = error ? "select-error" : "";
  const standardClass = `${styling.components.select} ${styling.general.element} `;

  // Navigation Logic
  let navigationControls = null;
  let wrapperClass = "";

  if (withNavigation && options?.length > 0) {
    wrapperClass = "flex flex-col gap-2";

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
    const IconPrev = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;
    const IconNext = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;

    navigationControls = (
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-xs opacity-70 font-medium">
          {currentIndex !== -1 ? `${displayIndex} / ${total}` : `0 / ${total}`}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-square btn-ghost"
            onClick={() => handleStep(-1)}
            disabled={props.disabled || currentIndex <= 0}
          >
            {IconPrev}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-square btn-ghost"
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
