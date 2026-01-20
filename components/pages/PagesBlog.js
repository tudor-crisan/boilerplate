"use client";
import Main from "@/components/common/Main";
import SectionFooter from "@/components/section/SectionFooter";
import SectionHeader from "@/components/section/SectionHeader";
import WrapperStyling from "@/components/wrapper/WrapperStyling";

export default function PagesBlog({ children }) {
  return (
    <WrapperStyling>
      <Main className="bg-base-100">
        <SectionHeader />
        {children}
        <SectionFooter />
      </Main>
    </WrapperStyling>
  );
}
