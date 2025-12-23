"use client";
import { useStyling } from "@/context/ContextStyling";

export default function WrapperFooter({ children }) {
  const { styling } = useStyling();

  return (
    <footer id="footer" className={styling.SectionFooter.section}>
      <div className={`${styling.SectionFooter.container} ${styling.SectionFooter.spacing} ${styling.SectionFooter.textalign}`}>
        {children}
      </div>
    </footer>
  )
}
