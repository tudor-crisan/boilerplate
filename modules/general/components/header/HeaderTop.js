"use client";
import IconLogo from "@/modules/general/components/icon/IconLogo";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { redirect } from "next/navigation";

export default function HeaderTop({ url = "" }) {
  const { visual } = useVisual();
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.flex.items_center} gap-2 ${url && "cursor-pointer"}`}
      onClick={() => (url ? redirect(url) : null)}
    >
      {visual.show.SectionHeader.logo && <IconLogo />}
      {visual.show.SectionHeader.appName && (
        <span className="font-bold text-md sm:text-lg">{settings.appName}</span>
      )}
    </div>
  );
}
