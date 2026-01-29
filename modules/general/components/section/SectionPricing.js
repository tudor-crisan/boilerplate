"use client";
import Divider from "@/modules/general/components/common/Divider";
import PricingButton from "@/modules/general/components/pricing/PricingButton";
import PricingCard from "@/modules/general/components/pricing/PricingCard";
import PricingPlanCard from "@/modules/general/components/pricing/PricingPlanCard";
import SectionHeading from "@/modules/general/components/section/SectionHeading";
import SectionWrapper from "@/modules/general/components/section/SectionWrapper";
import SvgCheck from "@/modules/general/components/svg/SvgCheck";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

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
        <div className={`${styling.flex.col} gap-3 mb-6`}>
          {/* Monthly Plan */}
          <div className={styling.flex.between}>
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
            <li
              key={index}
              className={cn(styling.flex.items_center, "text-sm gap-1")}
            >
              <SvgCheck />
              <p>{feature}</p>
            </li>
          ))}
        </ul>
        <PricingButton />
      </PricingCard>
    </SectionWrapper>
  );
}
