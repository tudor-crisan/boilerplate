"use client";
import { useStyling } from "@/context/ContextStyling";
import { useCopywriting } from "@/context/ContextCopywriting";
import PricingCard from "@/components/pricing/PricingCard";
import PricingPlanCard from "@/components/pricing/PricingPlanCard";
import PricingButton from "@/components/pricing/PricingButton";
import Divider from "@/components/common/Divider";
import SvgCheck from "@/components/svg/SvgCheck";
import { cn } from "@/libs/utils.client";

export default function SectionPricing() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section id="pricing" className="bg-base-200">
      <div className={cn(`${styling.general.container} ${styling.general.box}`, styling.SectionPricing.padding)}>
        <p className={`${styling.section.label} mb-2`}>
          {copywriting.SectionPricing.label}
        </p>
        <h2 className={`${styling.section.title} mb-12 text-center`}>
          {copywriting.SectionPricing.headline}
        </h2>
        <PricingCard>
          <div className="flex flex-col gap-3 mb-6">
            {/* Monthly Plan */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <div className="text-3xl font-black">
                  {copywriting.SectionPricing.formattedPlans.monthly.price}
                </div>
                <div className="text-sm font-medium opacity-60">
                  {copywriting.SectionPricing.formattedPlans.monthly.period}
                </div>
              </div>
              <div className="text-sm font-medium opacity-60">
                {copywriting.SectionPricing.formattedPlans.monthly.label}
              </div>
            </div>

            <Divider />

            {/* Lifetime Plan */}
            <PricingPlanCard
              item={copywriting.SectionPricing.formattedPlans.lifetime}
              isBestOffer={true}
            />
          </div>
          <ul className="space-y-1">
            {copywriting.SectionPricing.features.map((feature, index) => (
              <li key={index} className={`${styling.flex.items_center} text-sm gap-1`}>
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