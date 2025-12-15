"use client";
import { useCopywriting } from "@/components/context/ContextCopywriting";
import { useStyling } from "@/components/context/ContextStyling";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();
  return (
    <section className={`${styling.general.container} ${styling.general.spacing}`} id="faq">
      <div className={`${styling.SectionFAQ.positioning} justify-center`}>
        <div className="flex-1 space-y-2">
          <p className={`${styling.general.label}`}>
            {copywriting.SectionFAQ.label}
          </p>
          <h2 className={`${styling.general.title} text-center`}>
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