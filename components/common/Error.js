
"use client";
import SvgError from "@/components/svg/SvgError";
import { useStyling } from "@/context/ContextStyling";

export default function Error({ message, className = "" }) {
  const { styling } = useStyling();

  if (!message) return null;

  return (
    <div className={`alert alert-error mb-4 ${styling.flex.items_center} gap-2 p-3 text-sm ${styling.components.element} bg-error/10 text-red-500 ${className}`}>
      <SvgError className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
