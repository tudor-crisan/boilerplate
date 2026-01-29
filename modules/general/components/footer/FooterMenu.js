"use client";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import Link from "next/link";

export default function FooterMenu() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();

  const showHelp = visual.show.SectionFooter.help;
  const helpPath = settings.paths.help?.source;

  return (
    <>
      {copywriting.SectionFooter.menus.map((menu, index) => (
        <div key={index} className={`${styling.flex.col} gap-2`}>
          <h3 className="font-bold text-base-content/90">{menu.title}</h3>
          <div
            className={`${styling.flex.col} gap-1 text-sm text-base-content/70`}
          >
            {menu.links
              .filter((link) => showHelp || link.href !== helpPath)
              .map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}
