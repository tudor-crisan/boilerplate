"use client"
import { useStyling } from "@/components/base/StylingContext"
import settings from "@/config/settings.json";

export default function HtmlWrapper({ children }) {
  const { styling } = useStyling();
  return (
    <html
      lang={settings.language}
      data-theme={styling.theme}
      className={styling.general.html}
    >
      {children}
    </html>
  )
}