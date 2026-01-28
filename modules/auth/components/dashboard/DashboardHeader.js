"use client";
import { useStyling } from "@/context/ContextStyling";

export default function DashboardHeader({ children }) {
  const { styling } = useStyling();

  return (
    <section
      className={`${styling.general.container} bg-base-100 ${styling.flex.between} ${styling.components.header}`}
    >
      {children}
    </section>
  );
}
