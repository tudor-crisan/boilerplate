import styling from "@/config/styling.json";
import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";

export default function SectionPricing() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.section.spacing}`}>
        <p className={`${styling.SectionPricing.label} mb-2`}>
          Pricing
        </p>
        <h2 className={`${styling.SectionPricing.headline} mb-12 text-center`}>
          {copywriting.SectionPricing.headline}
        </h2>
        <div className="p-8 bg-base-100 max-w-96 rounded-3xl mx-auto space-y-6">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 text-primary"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  {feature}
                </p>
              </li>
            ))}
          </ul>
          <div>
            <ButtonLogin isLoggedIn={true} />
          </div>
        </div>
      </div>
    </section>
  )
}