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
import { cn } from "@/libs/utils.client";

export default function SectionHeader() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  const { copywriting } = useCopywriting();

  const showHeader = visual.show.SectionHeader;
  const menus = copywriting.SectionHeader?.menus;
  const hasMenu = showHeader.menu && menus && menus.length > 0;

  return (
    <section id="header" className={cn(styling.SectionHeader.colors)}>
      <WrapperHeader>
        {showHeader.top && (
          <HeaderTop url={settings.paths.home.source} />
        )}
        {hasMenu && (
          <>
            <HeaderMenu />
            <HeaderHamburger />
          </>
        )}
        {showHeader.button && (
          <HeaderButton className={cn(hasMenu && "hidden sm:block")} />
        )}
      </WrapperHeader>
    </section>
  );
}