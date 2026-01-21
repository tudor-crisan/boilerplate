"use client";

import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import Vertical from "@/components/common/Vertical";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";

export default function DashboardSuccess() {
  const { styling } = useStyling();

  return (
    <div
      className={`w-full max-w-md mx-auto ${styling.components.card} ${styling.general.box} text-center space-y-6 p-8`}
    >
      <div className="text-6xl animate-bounce">🎉</div>
      <Vertical className="space-y-2">
        <Title>Payment Successful!</Title>
        <Paragraph>
          Thank you for your purchase. You now have full access to all features.
        </Paragraph>
      </Vertical>
      <div className="flex justify-center pt-2">
        <Button
          variant="btn-primary"
          href={settings.paths.dashboard.source}
          className="w-full sm:w-auto min-w-50"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
