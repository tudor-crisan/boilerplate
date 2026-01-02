import { useStyling } from "@/context/ContextStyling";

export default function PricingCard({ children }) {
  const { styling } = useStyling();
  return (
    <div className={`${styling.components.card_featured} ${styling.paddings.card} max-w-96 mx-auto space-y-6`}>
      {children}
    </div>
  )
}