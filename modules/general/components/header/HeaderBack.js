"use client";
import ButtonBack from "@/modules/general/components/button/ButtonBack";
import HeaderTop from "@/modules/general/components/header/HeaderTop";
import WrapperHeader from "@/modules/general/components/wrapper/WrapperHeader";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function HeaderBack({ backUrl = "", className = "" }) {
  return (
    <section id="header" className={`bg-base-200 ${className}`}>
      <WrapperHeader className="bg-base-200">
        <HeaderTop url={settings.paths.home?.source} />
        <ButtonBack url={backUrl} />
      </WrapperHeader>
    </section>
  );
}
