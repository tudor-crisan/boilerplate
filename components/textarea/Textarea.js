"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Textarea({ className = "", error, ...props }) {
  const { styling } = useStyling();

  // Helper for error state
  const errorClass = error ? "textarea-error" : "";
  const standardClass = `${styling.roundness[0]} ${styling.shadows[0]} textarea`;

  return (
    <textarea
      className={`${standardClass} ${errorClass} ${className}`.trim()}
      {...props}
    />
  );
}
