import { cn } from "@/libs/utils.client"

export default function Label({ className, children }) {
  return (
    <label className={cn("block text-sm sm:text-md font-bold", className)}>
      {children}
    </label>
  )
}