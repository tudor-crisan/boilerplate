"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperFooter({ children }) {
  const { styling } = useStyling();

  return (
    <footer id="footer" className="bg-base-200 text-base-content">
      <div className={`${styling.general.box} ${styling.flex.responsive} ${styling.general.container} ${styling.SectionFooter.className} ${styling.SectionFooter.positioning}`}>
        {children}
      </div>
    </footer>
  )
}
