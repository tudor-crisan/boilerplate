"use client";
import { useVisual } from "@/context/ContextVisual";

export default function IconFavicon() {
  const { visual } = useVisual();

  if (!visual.favicon.href) return null;

  return (
    <link
      rel="icon"
      type={visual.favicon.type}
      sizes={visual.favicon.sizes}
      href={visual.favicon.href}
    />
  );
}
