"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";

export default function PricingCard({ children }) {
  const { styling } = useStyling();
  return (
    <div
      className={`${styling.components.card_featured} ${styling.general.box} max-w-96 mx-auto space-y-6`}
    >
      {children}
    </div>
  );
}
