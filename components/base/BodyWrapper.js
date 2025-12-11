"use client";
import { useStyling } from "@/components/base/StylingContext"

export default function BodyWrapper({ children }) {
  const { styling } = useStyling();
  return (
    <body className={styling.general.body}>
      {children}
    </body>
  )
}