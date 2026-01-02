
"use client";

import { useStyling } from "@/context/ContextStyling";

export default function DashboardMain({ children, className = "", size = 5 }) {
  const { styling } = useStyling();

  const maxWidths = {
    3: "max-w-3xl",
    4: "max-w-4xl",
    5: "max-w-5xl",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const maxWidthClass = maxWidths[size] || "max-w-5xl";

  return (
    <section className={`${maxWidthClass} mx-auto ${styling.general.spacing} ${className}`}>
      {children}
    </section>
  )
}