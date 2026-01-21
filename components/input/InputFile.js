"use client";

import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";
import { useState } from "react";

export default function InputFile({
  label,
  onChange,
  className,
  disabled,
  accept,
  ...props
}) {
  const { styling } = useStyling();
  const [internalLoading, setInternalLoading] = useState(false);

  const handleChange = async (e) => {
    if (onChange) {
      setInternalLoading(true);
      try {
        await onChange(e);
      } finally {
        setInternalLoading(false);
      }
    }
  };

    const rounding = styling.components.input?.match(/rounded-[a-z0-9]+/)?.[0] || "";

    return (
      <div className={cn("form-control w-full", className)}>
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <input
          type="file"
          className={cn(
            "file-input file-input-bordered w-full",
            styling.components.input, // This usually contains the rounding for the container
            rounding ? `file:${rounding}` : "", // Apply matching rounding to the internal button
            disabled || internalLoading ? "opacity-50 cursor-not-allowed" : "",
            "p-0"
          )}
          onChange={handleChange}
          disabled={disabled || internalLoading}
          accept={accept}
          {...props}
        />
      </div>
    );
}
