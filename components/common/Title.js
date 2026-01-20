import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function Title({ className, children, tag: Tag = "h1" }) {
  const { styling } = useStyling();
  const defaultClass = styling?.section?.title || "font-extrabold text-lg sm:text-xl";

  return (
    <Tag className={cn(defaultClass, className)}>
      {children}
    </Tag>
  )
}
