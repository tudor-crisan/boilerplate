import { cn } from "@/libs/utils.client"

export default function Title({ className, children, tag: Tag = "h1" }) {
  return (
    <Tag className={cn("font-extrabold text-lg sm:text-xl", className)}>
      {children}
    </Tag>
  )
}
