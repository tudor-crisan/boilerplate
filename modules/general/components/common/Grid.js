import { cn } from "@/modules/general/libs/utils.client";

export default function Grid({ children, className = "" }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-8", className)}>
      {children}
    </div>
  );
}
