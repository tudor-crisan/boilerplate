import styling from "@/config/styling.json";

export default function SectionPricing() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.section.spacing}`}>
        <p className={`${styling.SectionPricing.label} mb-4`}>
          Pricing
        </p>
        <h2 className={`${styling.SectionPricing.headline} mb-12 text-center`}>
          A pricing that adapts to your needs
        </h2>
      </div>
    </section>
  )
}