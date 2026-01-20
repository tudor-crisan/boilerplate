"use client";
import Accordion from "@/components/common/Accordion";
import SectionHeading from "@/components/section/SectionHeading";
import SectionWrapper from "@/components/section/SectionWrapper";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  const faq = copywriting.SectionFAQ;
  const accordionItems = faq.questions.map((item) => ({
    title: item.question,
    content: item.answer,
  }));

  return (
    <SectionWrapper id="faq" containerClassName={cn(styling.flex.col, "space-y-6 justify-center")}>
      <SectionHeading
        label={faq.label}
        headline={faq.headline}
        align="center"
      />
      <div className="flex-1">
        <Accordion items={accordionItems} />
      </div>
    </SectionWrapper>
  );
}