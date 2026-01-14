"use client";
import { useVisual } from "@/context/ContextVisual";
import { useStyling } from "@/context/ContextStyling";

export default function IconFavicon() {
  const { visual } = useVisual();
  const { styling } = useStyling();

  const href = styling?.logo || visual.favicon.href;

  if (!href) return null;

  return (
    <link
      rel="icon"
      type={visual.favicon.type}
      sizes={visual.favicon.sizes}
      href={href}
    />
  )
}