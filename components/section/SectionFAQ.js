"use client";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";
import Accordion from "@/components/common/Accordion";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  const accordionItems = copywriting.SectionFAQ.questions.map((faq) => ({
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <section id="faq" className={cn(`${styling.general.container} ${styling.general.box} bg-base-100`, styling.SectionFAQ.padding)}>
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
          <Accordion items={accordionItems} />
        </div>
      </div>
    </section>
  );
}