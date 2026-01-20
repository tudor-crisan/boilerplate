"use client";
import IconBusinessImage from "@/components/icon/IconBusinessImage";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";
import config from "@/package.json";
import Link from "next/link";

export default function FooterBrand() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${styling.flex.col} ${styling.SectionFooter.positioning} gap-1`}>
      <Link href={settings.business.website} className={styling.components.link}>
        <div className={`${styling.flex.items_center} gap-1 sm:gap-2 font-bold text-md sm:text-lg`}>
          <IconBusinessImage
            className="size-6 sm:size-5"
          />
          <span className="text-base-content">{settings.business.entity_name}</span>
        </div>
      </Link>
      <div className="text-sm text-base-content/60">
        © {currentYear} {copywriting.SectionFooter.brand.rights}
      </div>
      <div className="text-[10px] text-base-content/40">
        Build version {config.version}
      </div>
    </div>
  );
}
