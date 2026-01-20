import { useStyling } from "@/context/ContextStyling";

export default function Title({ className, children, tag: Tag = "h1" }) {
  const { styling } = useStyling();
  const defaultClass = styling?.section?.title || "font-extrabold text-lg sm:text-xl";

  return (
    <Tag className={cn(defaultClass, className)}>
      {children}
    </Tag>
  )
}
