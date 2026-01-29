"use client";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function FooterSocial() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  if (!settings.business.socials || settings.business.socials.length === 0) {
    return null;
  }

  return (
    <div className={`${styling.flex.col} gap-2`}>
      <h3 className="font-bold text-base-content/90">
        {copywriting.SectionFooter.socials.label}
      </h3>
      <div
        className={`${styling.flex.col} ${styling.SectionFooter.positioning} gap-1 text-sm text-base-content/70`}
      >
        {settings.business.socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-primary transition-colors ${styling.flex.items_center} gap-2`}
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
