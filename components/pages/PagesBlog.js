"use client";
import SectionHeader from "@/components/section/SectionHeader";
import WrapperStyling from "@/components/wrapper/WrapperStyling";
import Main from "@/components/common/Main";
import SectionFooter from "@/components/section/SectionFooter";

export default function PagesBlog({ children }) {
  return (
    <WrapperStyling>
      <Main className="bg-base-100">
        <SectionHeader />
        <div className="py-12">
          {children}
        </div>
        <SectionFooter />
      </Main>
    </WrapperStyling>
  );
}
