import styling from "@/config/styling.json";

export default function SectionPricing() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.section.spacing}`}>
        <p className={`${styling.pricing.label}`}>
          Pricing
        </p>
        <h2 className={`${styling.pricing.headline} mb-12 text-center`}>
          A pricing that adapts to your needs
        </h2>
      </div>
    </section>
  )
}