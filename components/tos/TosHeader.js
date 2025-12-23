"use client";
import ButtonBack from "@/components/button/ButtonBack";
import HeaderTop from "@/components/header/HeaderTop";
import WrapperHeader from "@/components/wrapper/WrapperHeader";

export default function TosHeader() {
  return (
    <section id="header" className="bg-base-200">
      <WrapperHeader className="bg-base-200">
        <HeaderTop url="/" />
        <ButtonBack />
      </WrapperHeader>
    </section>
  );
}