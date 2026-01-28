"use client";
import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";

export default function HelpContactSupport() {
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.flex.col_center} space-y-3 mb-10 mt-12 pt-12 border-t border-base-content/20 w-full`}
    >
      <Paragraph className={styling.section.paragraph}>
        Can&apos;t find what you&apos;re looking for?
      </Paragraph>
      <Button href={settings.paths.support.source} variant="btn-outline">
        Contact Support
      </Button>
    </div>
  );
}
