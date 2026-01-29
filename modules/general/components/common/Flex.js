"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

export default function Flex({ children, className = "" }) {
  const { styling } = useStyling();

  return (
    <div className={cn(`${styling.flex.center}`, className)}>{children}</div>
  );
}
