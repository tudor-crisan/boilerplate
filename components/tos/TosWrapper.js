"use client";
import TosHeader from "@/components/tos/TosHeader";
import { useStyling } from "@/context/ContextStyling";
import Main from "@/components/common/Main";

export default function TosWrapper({ children }) {
  const { styling } = useStyling();
  return (
    <Main className="bg-base-100">
      <TosHeader />
      <div className={`${styling.general.container} ${styling.general.box}`}>
        {children}
      </div>
    </Main>
  );
}