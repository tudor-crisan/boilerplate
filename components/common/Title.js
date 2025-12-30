import { cn } from "@/libs/utils.client"

export default function Title({ className, children }) {
  return (
    <h1 className={cn("font-extrabold text-lg sm:text-xl", className)}>
      {children}
    </h1>
  )
}
