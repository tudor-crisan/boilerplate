import { useStyling } from "@/context/ContextStyling";

export default function PricingCard({ children }) {
  const { styling } = useStyling();
  return (
    <div className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.paddings.card} bg-base-100 max-w-96 mx-auto space-y-6`}>
      {children}
    </div>
  )
}