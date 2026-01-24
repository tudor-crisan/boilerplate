"use client";
import Label from "@/components/common/Label";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function SectionHeading({
  label,
  headline,
  paragraph,
  className,
  align = "center",
  labelClassName,
  headlineClassName,
  paragraphClassName,
}) {
  const { styling } = useStyling();

  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  const getResponsiveAlignment = (value) => {
    if (alignments[value]) return alignments[value];

    // Handle common responsive patterns from styling0.json
    if (value === "text-center sm:text-left") {
      return "text-center items-center mx-auto sm:text-left sm:items-start sm:mx-0 sm:mr-auto";
    }

    if (value === "text-center") {
      return "text-center items-center mx-auto";
    }

    return value;
  };

  return (
    <div
      className={cn(
        "space-y-4 max-w-2xl",
        getResponsiveAlignment(align),
        className,
      )}
    >
      {label && (
        <Label className={cn(styling.section.label, labelClassName)}>
          {label}
        </Label>
      )}
      {headline && (
        <Title
          tag="h2"
          className={cn(styling.section.title, headlineClassName)}
        >
          {headline}
        </Title>
      )}
      {paragraph && (
        <Paragraph className={cn("opacity-80", paragraphClassName)}>
          {paragraph}
        </Paragraph>
      )}
    </div>
  );
}
