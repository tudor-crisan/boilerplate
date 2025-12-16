"use client";
import { useStyling } from "@/components/context/ContextStyling";
import { useCopywriting } from "@/components/context/ContextCopywriting";
import PricingCard from "@/components/pricing/PricingCard";
import PricingButton from "@/components/pricing/PricingButton";
import SvgCheck from "@/components/svg/SvgCheck";

export default function SectionPricing() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section className="bg-base-200" id="pricing">
      <div className={`${styling.general.container} ${styling.general.spacing}`}>
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
          <div>
            <PricingButton className="w-full" />
          </div>
        </PricingCard>
      </div>
    </section>
  )
}