"use client";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import HeaderTop from "@/components/header/HeaderTop";
import HeaderMenu from "@/components/header/HeaderMenu";
import HeaderHamburger from "@/components/header/HeaderHamburger";
import HeaderButton from "@/components/header/HeaderButton";
import { useVisual } from "@/context/ContextVisual";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCopywriting } from "@/context/ContextCopywriting";

export default function SectionHeader() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  const { copywriting } = useCopywriting();

  const hasMenu = (
    visual.show.SectionHeader.menu &&
    copywriting.SectionHeader.menus &&
    copywriting.SectionHeader.menus.length > 0
  );

  return (
    <section id="header" className={styling.SectionHeader.colors}>
      <WrapperHeader>
        {visual.show.SectionHeader.top && (
          <HeaderTop url={settings.paths.home.source} />
        )}
        {hasMenu && (
          <>
            <HeaderMenu />
            <HeaderHamburger />
          </>
        )}
        {visual.show.SectionHeader.button && (
          <HeaderButton className={hasMenu ? "hidden sm:block" : ""} />
        )}
      </WrapperHeader>
    </section>
  );
}