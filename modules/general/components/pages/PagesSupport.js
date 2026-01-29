"use client";
import Button from "@/modules/general/components/button/Button";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import TosContent from "@/modules/general/components/tos/TosContent";
import TosWrapper from "@/modules/general/components/tos/TosWrapper";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import HelpSupport from "@/modules/help/components/help/HelpSupport";

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
            <Button href={settings.paths.help?.source} variant="btn-outline">
              View Help Articles
            </Button>
          </div>
        )}
      </TosContent>
    </TosWrapper>
  );
}
