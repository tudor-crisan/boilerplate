"use client";

import { useStyling } from "@/context/ContextStyling";

export default function DashboardMain({ children, className = "" }) {
  const { styling } = useStyling();

  return (
    <section
      className={`${styling.general.container} mx-auto ${styling.general.box} ${className}`}
    >
      {children}
    </section>
  );
}
