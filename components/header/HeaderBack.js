"use client";
import ButtonBack from "@/components/button/ButtonBack";
import HeaderTop from "@/components/header/HeaderTop";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import { defaultSetting as settings } from "@/libs/defaults";

export default function HeaderBack({ backUrl = "", className = "" }) {
  return (
    <section id="header" className={`bg-base-200 ${className}`}>
      <WrapperHeader className="bg-base-200">
        <HeaderTop url={settings.paths.home.source} />
        <ButtonBack url={backUrl} />
      </WrapperHeader>
    </section>
  );
}
