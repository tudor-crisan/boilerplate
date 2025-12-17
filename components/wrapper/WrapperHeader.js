"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperHeader({ children }) {
  const { styling } = useStyling();

  return (
    <div className={`${styling.general.container} flex justify-between items-center px-4 py-2`}>
      {children}
    </div>
  )
}