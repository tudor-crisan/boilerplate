"use client";
import { useCopywriting } from "@/context/ContextCopywriting";
import HeaderButton from "@/components/header/HeaderButton";
import Link from "next/link";
import IconLogo from "@/components/icon/IconLogo";
import { useVisual } from "@/context/ContextVisual";
import { useStyling } from "@/context/ContextStyling";

export default function SectionHeader() {
  const { visual } = useVisual();
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section id="header" className="bg-base-200">
      <div className={`${styling.general.container} flex justify-between items-center px-4 py-2`}>
        <div className="flex items-center gap-2">
          {visual.show.SectionHeader.logo && (
            <IconLogo />
          )}
          {visual.show.SectionHeader.appName && (
            <span className="font-bold">
              {copywriting.SectionHeader.appName}
            </span>
          )}
        </div>
        {visual.show.SectionHeader.menu && (
          <div className="space-x-4 max-md:hidden">
            {copywriting.SectionHeader.menus.map((menu, index) => (
              <Link href={menu.path} key={index} className={styling.links[0]}>
                {menu.label}
              </Link>
            ))}
          </div>
        )}
        {visual.show.SectionHeader.button && (
          <div>
            <HeaderButton />
          </div>
        )}
      </div>
    </section>
  );
}