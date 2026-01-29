import { cn } from "@/modules/general/libs/utils.client";

export default function Paragraph({ className = "", children }) {
  return (
    <p className={cn("text-base-content/70 overflow-auto", className)}>
      {children}
    </p>
  );
}
