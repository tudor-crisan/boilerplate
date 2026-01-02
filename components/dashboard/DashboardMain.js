
"use client";

import { useStyling } from "@/context/ContextStyling";

export default function DashboardMain({ children, className = "" }) {
  const { styling } = useStyling();
  return (
    <section className={`max-w-5xl mx-auto ${styling.general.spacing} ${className}`}>
      {children}
    </section>
  )
}