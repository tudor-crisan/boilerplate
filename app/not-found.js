"use client";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import HeaderBack from "@/modules/general/components/header/HeaderBack";
import Svg404 from "@/modules/general/components/svg/Svg404";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function NotFound() {
  const { styling } = useStyling();

  return (
    <main className="min-h-screen bg-base-100 flex flex-col">
      <HeaderBack backUrl={settings.paths.home?.source} />

      <div
        className={`grow flex flex-col items-center justify-start pt-24 text-center p-4 space-y-6 ${styling.general.container}`}
      >
        <Svg404 className="w-24 h-24 text-base-content/80" />
        <div className="space-y-2">
          <Title>Page Not Found</Title>
          <Paragraph>
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </Paragraph>
        </div>
      </div>
    </main>
  );
}
