"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperHeader({ children }) {
  const { styling } = useStyling();

  return (
    <div className={`${styling.general.container} ${styling.flex.between} px-3 sm:px-5 py-3`}>
      {children}
    </div>
  )
}