"use client";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function Flex({ children, className = "" }) {
  const { styling } = useStyling();

  return (
    <div className={cn(`${styling.flex.center}`, className)}>
      {children}
    </div>
  );
}
