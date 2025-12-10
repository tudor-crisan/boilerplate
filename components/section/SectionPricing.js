import styling from "@/config/styling.json";
import copywriting from "@/config/copywriting.json";

export default function SectionPricing() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.section.spacing}`}>
        <p className={`${styling.SectionPricing.label} mb-4`}>
          Pricing
        </p>
        <h2 className={`${styling.SectionPricing.headline} mb-12 text-center`}>
          {copywriting.SectionPricing.headline}
        </h2>
        <div className="p-8 bg-base-100 max-w-96 rounded-3xl mx-auto">
          <div className="flex items-baseline">
            <div className="text-4xl font-black">
              {copywriting.SectionPricing.price}
            </div>
            <div className="text-sm font-medium opacity-60">
              {copywriting.SectionPricing.period}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}