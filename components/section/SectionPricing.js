"use client";
import { useStyling } from "@/context/ContextStyling";
import { useCopywriting } from "@/context/ContextCopywriting";
import PricingCard from "@/components/pricing/PricingCard";
import PricingPlanCard from "@/components/pricing/PricingPlanCard";
import PricingButton from "@/components/pricing/PricingButton";
import Divider from "@/components/common/Divider";
import SvgCheck from "@/components/svg/SvgCheck";
import SectionHeading from "@/components/section/SectionHeading";
import SectionWrapper from "@/components/section/SectionWrapper";
import { cn } from "@/libs/utils.client";

export default function SectionPricing() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  const pricing = copywriting.SectionPricing;

  return (
    <SectionWrapper id="pricing" background="bg-base-200">
      <SectionHeading
        label={pricing.label}
        headline={pricing.headline}
        align="center"
        className="mb-12"
      />
      <PricingCard>
        <div className="flex flex-col gap-3 mb-6">
          {/* Monthly Plan */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <div className="text-3xl font-black">
                {pricing.formattedPlans.monthly.price}
              </div>
              <div className="text-sm font-medium opacity-60">
                {pricing.formattedPlans.monthly.period}
              </div>
            </div>
            <div className="text-sm font-medium opacity-60">
              {pricing.formattedPlans.monthly.label}
            </div>
          </div>

          <Divider />

          {/* Lifetime Plan */}
          <PricingPlanCard
            item={pricing.formattedPlans.lifetime}
            isBestOffer={true}
          />
        </div>
        <ul className="space-y-1">
          {pricing.features.map((feature, index) => (
            <li key={index} className={cn(styling.flex.items_center, "text-sm gap-1")}>
              <SvgCheck />
              <p>
                {feature}
              </p>
            </li>
          ))}
        </ul>
        <PricingButton />
      </PricingCard>
    </SectionWrapper>
  )
}
