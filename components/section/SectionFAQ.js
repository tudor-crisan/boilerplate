import copywriting from "@/config/copywriting.json";
import styling from "@/config/styling.json";

export default function SectionFAQ() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing}`} id="faq">
      <p className={`${styling.section.label} mb-2`}>
        {copywriting.SectionFAQ.label}
      </p>
      <h2 className={`${styling.section.headline} mb-12 text-center`}>
        {copywriting.SectionFAQ.headline}
      </h2>

      {copywriting.SectionFAQ.questions.map((faq, index) => (
        <div className="collapse collapse-arrow bg-base-200 border border-base-300 my-2" key={index}>
          <input type="radio" name="faq-accordion" defaultChecked={!index} />
          <div className="collapse-title font-semibold text-primary">
            {faq.question}
          </div>
          <div className="collapse-content text-sm">
            {faq.answer}
          </div>
        </div>
      ))}
    </section>
  );
}