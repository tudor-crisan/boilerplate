"use client";
import IconLogo from "@/components/icon/IconLogo";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useVisual } from "@/context/ContextVisual";

export default function HeaderTop() {
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();

  return (
    <div className="flex items-center gap-2">
      {visual.show.SectionHeader.logo && (
        <IconLogo />
      )}
      {visual.show.SectionHeader.appName && (
        <span className="font-bold text-md md:text-lg">
          {copywriting.SectionHeader.appName}
        </span>
      )}
    </div>
  )
}