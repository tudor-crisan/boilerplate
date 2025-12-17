"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperHeader({ children }) {
  const { styling } = useStyling();

  return (
    <div className={`${styling.general.container} ${styling.SectionHeader.spacing}`}>
      {children}
    </div>
  )
}