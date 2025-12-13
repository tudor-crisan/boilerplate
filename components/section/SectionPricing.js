"use client";
import { useStyling } from "@/components/context/ContextStyling";
import { useCopywriting } from "@/components/context/ContextCopywriting";
import ButtonLogin from "@/components/button/ButtonLogin";
import IconCheck from "@/components/icon/IconCheck";

export default function SectionPricing() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section className="bg-base-200" id="pricing">
      <div className={`${styling.general.wrapper} ${styling.general.spacing}`}>
        <p className={`${styling.general.label} mb-2`}>
          {copywriting.SectionPricing.label}
        </p>
        <h2 className={`${styling.general.headline} mb-12 text-center`}>
          {copywriting.SectionPricing.headline}
        </h2>
        <div className={`${styling.roundness[1]} ${styling.shadows[1]} p-8 bg-base-100 max-w-96 mx-auto space-y-6`}>
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
                <IconCheck />
                <p>
                  {feature}
                </p>
              </li>
            ))}
          </ul>
          <div>
            <ButtonLogin
              isLoggedIn={true}
              extraStyle="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}