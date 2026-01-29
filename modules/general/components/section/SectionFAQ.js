"use client";
import Accordion from "@/modules/general/components/common/Accordion";
import SectionHeading from "@/modules/general/components/section/SectionHeading";
import SectionWrapper from "@/modules/general/components/section/SectionWrapper";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";

export default function SectionFAQ() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  const faq = copywriting.SectionFAQ;
  const accordionItems = faq.questions.map((item) => ({
    title: item.question,
    content: item.answer,
  }));

  return (
    <SectionWrapper
      id="faq"
      containerClassName={cn(styling.flex.col, "space-y-6 justify-center")}
    >
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
