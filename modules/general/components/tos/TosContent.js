import { cn } from "@/modules/general/libs/utils.client";

export default function TosContent({ children, className = "" }) {
  return (
    <div
      className={cn(
        "space-y-4 leading-relaxed opacity-90 text-base-content",
        className,
      )}
    >
      {children}
    </div>
  );
}
