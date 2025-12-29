"use client";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCopywriting } from "@/context/ContextCopywriting";

export default function FooterSocial() {
  const { copywriting } = useCopywriting();


  if (!settings.business.socials || settings.business.socials.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-base-content/90">{copywriting.SectionFooter.socials.label}</h3>
      <div className="flex flex-col items-center sm:items-start gap-1 text-sm text-base-content/70">
        {settings.business.socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-2"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
