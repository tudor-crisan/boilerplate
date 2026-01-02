"use client";
import { useStyling } from "@/context/ContextStyling";

export default function DashboardHeader({ children }) {
  const { styling } = useStyling();
  return (
    <section className={`max-w-5xl mx-auto bg-base-100 ${styling.SectionHeader.spacing}`}>
      {children}
    </section>
  )
}