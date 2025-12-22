"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Input({ className = "", error, ...props }) {
  const { styling } = useStyling();

  // Basic defaults for text-like inputs
  // We avoid adding 'input' class to radio/checkbox to prevent styling conflicts
  const isCheckable = props.type === "radio" || props.type === "checkbox";

  let defaultClasses = "";
  if (!isCheckable) {
    // Apply standard input class and global roundness
    defaultClasses = `input ${styling.roundness[0]}`;
  }

  // Helper for error state
  const errorClass = error ? "input-error" : "";

  return (
    <input
      className={`${defaultClasses} ${errorClass} ${className}`.trim()}
      {...props}
    />
  );
}
