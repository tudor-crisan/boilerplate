import { cn } from "@/modules/general/libs/utils.client";

export default function TextSmall({ className, children }) {
  return (
    <span
      className={cn(
        "text-xs text-base-content/60 font-medium leading-none block",
        className,
      )}
    >
      {children}
    </span>
  );
}
