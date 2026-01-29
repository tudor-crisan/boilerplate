"use client";

export default function CharacterCount({
  currentLength,
  maxLength,
  className = "",
}) {
  if (!maxLength) return null;

  return (
    <div
      className={`absolute p-1 right-2 text-xs text-base-content/40 font-medium pointer-events-none ${className}`}
    >
      {currentLength} / {maxLength}
    </div>
  );
}
