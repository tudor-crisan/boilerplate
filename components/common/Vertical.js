"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Vertical({ className = "", children }) {
  const { styling } = useStyling();
  return (
    <div className={`${styling?.flex?.col || "flex flex-col"} gap-2 ${className}`}>
      {children}
    </div>
  )
}
