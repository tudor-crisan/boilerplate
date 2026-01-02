"use client";
import Image from "next/image";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function FooterBrand() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${styling.flex.col} gap-1 max-w-xs`}>
      <Link href={settings.business.website} className={styling.components.link}>
        <div className={`${styling.flex.items_center} gap-1 sm:gap-2 font-bold text-lg sm:text-xl`}>
          {settings.business.logo && (
            <Image
              src={settings.business.logo}
              alt={settings.business.entity_name}
              width={32}
              height={32}
              className={`${styling.components.element} size-6 sm:size-8`}
            />
          )}
          <span>{settings.business.entity_name}</span>
        </div>
      </Link>
      <div className="text-sm text-base-content/60">
        © {currentYear} {copywriting.SectionFooter.brand.rights}
      </div>
    </div>
  );
}
