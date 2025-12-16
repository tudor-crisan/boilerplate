"use client"
import { useStyling } from "@/context/ContextStyling"

export default function WrapperHtml({ children }) {
  const { styling } = useStyling();
  return (
    <html
      lang={styling.general.language}
      data-theme={styling.theme}
      className={styling.general.html}
    >
      {children}
    </html>
  )
}