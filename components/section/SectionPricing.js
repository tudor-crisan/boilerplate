"use client";
import { useStyling } from "@/context/ContextStyling";
import { useCopywriting } from "@/context/ContextCopywriting";
import PricingCard from "@/components/pricing/PricingCard";
import PricingButton from "@/components/pricing/PricingButton";
import SvgCheck from "@/components/svg/SvgCheck";
import { cn } from "@/libs/utils.client";

export default function SectionPricing() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section id="pricing" className="bg-base-200">
      <div className={cn(`${styling.general.container} ${styling.general.padding}`, 'py-32!')}>
        <p className={`${styling.general.label} mb-2`}>
          {copywriting.SectionPricing.label}
        </p>
        <h2 className={`${styling.general.title} mb-12 text-center`}>
          {copywriting.SectionPricing.headline}
        </h2>
        <PricingCard>
          <div className="flex items-baseline mb-4">
            <div className="text-4xl font-black">
              {copywriting.SectionPricing.price}
            </div>
            <div className="text-sm font-medium opacity-60">
              {copywriting.SectionPricing.period}
            </div>
          </div>
          <ul className="space-y-1">
            {copywriting.SectionPricing.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm gap-1">
                <SvgCheck />
                <p>
                  {feature}
                </p>
              </li>
            ))}
          </ul>
          <PricingButton />
        </PricingCard>
      </div>
    </section>
  )
}