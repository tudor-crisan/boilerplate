"use client";
import ButtonBack from "@/components/button/ButtonBack";
import HeaderTop from "@/components/header/HeaderTop";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import { defaultSetting as settings } from "@/libs/defaults";

export default function TosHeader() {
  return (
    <section id="header" className="bg-base-200">
      <WrapperHeader className="bg-base-200">
        <HeaderTop url={settings.paths.home.source} />
        <ButtonBack />
      </WrapperHeader>
    </section>
  );
}