import { cn } from "@/libs/cn"

export default function Title({ className, children }) {
  return (
    <h1 className={cn("font-extrabold text-lg sm:text-xl", className)}>
      {children}
    </h1>
  )
}
