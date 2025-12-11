"use client";
import { useStyling } from "@/components/context/ContextStyling"

export default function WrapperBody({ children }) {
  const { styling } = useStyling();
  return (
    <body className={styling.general.body}>
      {children}
    </body>
  )
}