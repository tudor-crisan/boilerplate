"use client";
import HeaderButton from "@/components/header/HeaderButton";
import HeaderHamburger from "@/components/header/HeaderHamburger";
import HeaderMenu from "@/components/header/HeaderMenu";
import HeaderTop from "@/components/header/HeaderTop";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import { defaultSetting as settings } from "@/libs/defaults";
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
        {showHeader.top && <HeaderTop url={settings.paths.home?.source} />}
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
