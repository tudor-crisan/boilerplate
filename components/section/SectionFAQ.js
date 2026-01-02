"use client";
import { useState } from "react";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();
  const [openIndices, setOpenIndices] = useState([0]);

  const handleToggle = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className={cn(`${styling.general.container} ${styling.general.box} bg-base-100`, 'py-32!')}>
      <div className={`${styling.flex.col} space-y-6 justify-center`}>
        <div className="flex-1 space-y-2">
          <p className={`${styling.section.label}`}>
            {copywriting.SectionFAQ.label}
          </p>
          <h2 className={`${styling.section.title} text-center`}>
            {copywriting.SectionFAQ.headline}
          </h2>
        </div>
        <div className="flex-1">
          {copywriting.SectionFAQ.questions.map((faq, index) => (
            <div
              key={index}
              className={`${styling.components.card} collapse collapse-arrow bg-base-200 my-2 ${openIndices.includes(index) ? "collapse-open" : ""}`}
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