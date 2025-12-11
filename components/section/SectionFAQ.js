import copywriting from "@/config/copywriting.json";
import styling from "@/config/styling.json";

export default function SectionFAQ() {
  return (
    <section className={`${styling.general.wrapper} ${styling.general.spacing}`} id="faq">
      <div className={`${styling.SectionFAQ.positioning} justify-center`}>
        <div className="flex-1 space-y-2">
          <p className={`${styling.general.label}`}>
            {copywriting.SectionFAQ.label}
          </p>
          <h2 className={`${styling.general.headline} text-center`}>
            {copywriting.SectionFAQ.headline}
          </h2>
        </div>
        <div className="flex-1">
          {copywriting.SectionFAQ.questions.map((faq, index) => (
            <div key={index} className={`${styling.roundness[1]} ${styling.borders[0]} collapse collapse-arrow bg-base-200 my-2`}>
              <input type="radio" name="faq-accordion" defaultChecked={!index} />
              <div className="collapse-title font-semibold text-primary">
                {faq.question}
              </div>
              <div className="collapse-content text-sm">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}