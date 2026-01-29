"use client";
import Main from "@/modules/general/components/common/Main";
import SectionFooter from "@/modules/general/components/section/SectionFooter";
import SectionHeader from "@/modules/general/components/section/SectionHeader";
import WrapperStyling from "@/modules/general/components/wrapper/WrapperStyling";

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
