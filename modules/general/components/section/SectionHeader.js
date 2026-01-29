"use client";
import HeaderButton from "@/modules/general/components/header/HeaderButton";
import HeaderHamburger from "@/modules/general/components/header/HeaderHamburger";
import HeaderMenu from "@/modules/general/components/header/HeaderMenu";
import HeaderTop from "@/modules/general/components/header/HeaderTop";
import WrapperHeader from "@/modules/general/components/wrapper/WrapperHeader";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { cn } from "@/modules/general/libs/utils.client";

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
