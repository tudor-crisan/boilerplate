"use client";
import Main from "@/modules/general/components/common/Main";
import TosHeader from "@/modules/general/components/tos/TosHeader";
import { useStyling } from "@/modules/general/context/ContextStyling";

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
