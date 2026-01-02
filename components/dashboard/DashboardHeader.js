"use client";
import { useStyling } from "@/context/ContextStyling";

export default function DashboardHeader({ children }) {
  const { styling } = useStyling();

  return (
    <section className={`${styling.general.container} bg-base-100 ${styling.flex.between} px-3 sm:px-5 py-3`}>
      {children}
    </section>
  )
}