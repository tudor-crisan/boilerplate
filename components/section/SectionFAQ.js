"use client";
import { useState } from "react";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className={`${styling.general.container} ${styling.general.spacing} bg-base-100`}>
      <div className={`${styling.SectionFAQ.spacing} justify-center`}>
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
            <div
              key={index}
              className={`${styling.roundness[1]} ${styling.borders[0]} collapse collapse-arrow bg-base-200 my-2 ${openIndex === index ? "collapse-open" : ""}`}
              onClick={() => handleToggle(index)}
            >
              <div className="collapse-title font-semibold text-primary cursor-pointer">
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