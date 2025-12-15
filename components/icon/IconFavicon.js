"use client";
import { useVisual } from "@/components/context/ContextVisual";

export default function IconFavicon() {
  const { visual } = useVisual();
  return (
    <link
      rel="icon"
      type={visual.favicon.type}
      sizes={visual.favicon.sizes}
      href={visual.favicon.href}
    />
  )
}