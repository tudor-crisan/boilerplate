"use client";
import Button from "@/modules/general/components/button/Button";
import Paragraph from "@/modules/general/components/common/Paragraph";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function HelpContactSupport() {
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.flex.col_center} space-y-3 mb-10 mt-12 pt-12 border-t border-base-content/20 w-full`}
    >
      <Paragraph className={styling.section.paragraph}>
        Can&apos;t find what you&apos;re looking for?
      </Paragraph>
      <Button href={settings.paths.support?.source} variant="btn-outline">
        Contact Support
      </Button>
    </div>
  );
}
