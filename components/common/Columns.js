"use client";
import { useStyling } from "@/context/ContextStyling";

export default function Columns({ className = "", children }) {
  const { styling } = useStyling();
  return (
    <div
      className={`${styling?.flex?.col || "flex flex-col"} sm:flex-row sm:items-start sm:gap-4 gap-10 pb-6 ${className}`}
    >
      {children}
    </div>
  );
}
