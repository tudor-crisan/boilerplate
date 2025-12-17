"use client";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import HeaderTop from "@/components/header/HeaderTop";
import HeaderMenu from "@/components/header/HeaderMenu";
import HeaderButton from "@/components/header/HeaderButton";
import { useVisual } from "@/context/ContextVisual";

export default function SectionHeader() {
  const { visual } = useVisual();
  return (
    <section id="header" className="bg-base-200">
      <WrapperHeader>
        {visual.show.SectionHeader.top && (
          <HeaderTop />
        )}
        {visual.show.SectionHeader.menu && (
          <HeaderMenu />
        )}
        {visual.show.SectionHeader.button && (
          <HeaderButton />
        )}
      </WrapperHeader>
    </section>
  );
}