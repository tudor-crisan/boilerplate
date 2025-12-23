"use client";
import Image from "next/image";
import useSettings from "@/hooks/useSettings";
import { useCopywriting } from "@/context/ContextCopywriting";

export default function FooterBrand() {
  const { copywriting } = useCopywriting();
  const settings = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-1 max-w-xs">
      <div className="flex items-center gap-1 sm:gap-2 font-bold text-lg sm:text-xl">
        {settings.business.logo && (
          <Image
            src={settings.business.logo}
            alt={settings.business.entity_name}
            width={32}
            height={32}
            className="size-6 sm:size-8 rounded-lg sm:rounded-xl"
          />
        )}
        <span>{settings.business.entity_name}</span>
      </div>
      <div className="text-sm text-base-content/60">
        © {currentYear} {copywriting.SectionFooter.brand.rights}
      </div>
    </div>
  );
}
