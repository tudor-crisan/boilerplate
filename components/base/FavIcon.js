"use client";
import { useStyling } from "@/components/base/StylingContext";

export default function FavIcon() {
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