"use client";
import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import HelpSupport from "@/components/help/HelpSupport";
import TosContent from "@/components/tos/TosContent";
import TosWrapper from "@/components/tos/TosWrapper";
import { useVisual } from "@/context/ContextVisual";
import { defaultSetting as settings } from "@/libs/defaults";

export default function PagesSupport() {
  const { visual } = useVisual();

  return (
    <TosWrapper>
      <TosContent className="text-center sm:text-left">
        <div className="space-y-1">
          <Title>Support</Title>
          <Paragraph>
            Need help? We are here for you. Please reach out to us using the
            contact details below.
          </Paragraph>
        </div>

        <HelpSupport />

        {visual.show.SectionFooter.help && (
          <div className="space-y-3 my-10">
            <Paragraph>Looking for quick answers?</Paragraph>
            <Button href={settings.paths.help.source} variant="btn-outline">
              View Help Articles
            </Button>
          </div>
        )}
      </TosContent>
    </TosWrapper>
  );
}
