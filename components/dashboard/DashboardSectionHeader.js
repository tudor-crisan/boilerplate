"use client";
import ButtonLogout from "@/components/button/ButtonLogout";
import HeaderTop from "@/components/header/HeaderTop";
import { useStyling } from "@/context/ContextStyling";
import { redirect } from "next/navigation";

export default function DashboardSectionHeader() {
  const { styling } = useStyling();

  return (
    <section className={`max-w-5xl mx-auto bg-base-100 ${styling.SectionHeader.spacing}`}>
      <div
        className="cursor-pointer"
        onClick={() => redirect("/")}
      >
        <HeaderTop />
      </div>
      <ButtonLogout />
    </section>
  )
}