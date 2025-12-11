"use client";
import { useStyling } from "@/components/context/ContextStyling";

export default function IconFavicon() {
  const { styling } = useStyling();
  return (
    <link
      rel="icon"
      type={styling.favicon.type}
      sizes={styling.favicon.sizes}
      href={styling.favicon.href}
    />
  )
}