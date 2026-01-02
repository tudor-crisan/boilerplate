"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperFooter({ children }) {
  const { styling } = useStyling();

  return (
    <footer id="footer" className="bg-base-200 text-base-content">
      <div className={`${styling.general.box} ${styling.flex.col} sm:flex-row justify-between gap-10 sm:gap-16 ${styling.SectionFooter.textalign} ${styling.general.container} text-center sm:text-left`}>
        {children}
      </div>
    </footer>
  )
}
