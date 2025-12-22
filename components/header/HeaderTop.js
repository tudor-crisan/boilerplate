"use client";
import IconLogo from "@/components/icon/IconLogo";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useVisual } from "@/context/ContextVisual";
import { redirect } from "next/navigation";

export default function HeaderTop({ url = "" }) {
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();

  return (
    <div
      className={`flex items-center gap-2 ${url && 'cursor-pointer'}`}
      onClick={() => url ? redirect(url) : null}
    >
      {visual.show.SectionHeader.logo && (
        <IconLogo />
      )}
      {visual.show.SectionHeader.appName && (
        <span className="font-bold text-md sm:text-lg">
          {copywriting.SectionHeader.appName}
        </span>
      )}
    </div>
  )
}