"use client";
import { useStyling } from "@/context/ContextStyling";
import shuffle from "@/libs/shuffle";
import fonts from "@/lists/fonts";
import { useEffect, useState } from "react";

export default function WrapperHtml({ children }) {
  const { styling } = useStyling();
  const [shuffledFont, setShuffledFont] = useState(null);

  useEffect(() => {
    const handleShuffle = () => {
      if (shuffle.font.isEnabled) {
        const sFont = localStorage.getItem("shuffle-font");
        if (sFont && fonts[sFont]) {
          setShuffledFont(fonts[sFont].className);
        }
      }
    };

    window.addEventListener("shuffle-font", handleShuffle);
    return () => window.removeEventListener("shuffle-font", handleShuffle);
  }, []);

  const activeFontClass =
    shuffledFont || fonts[styling.font]?.className || fonts["sen"].className;

  return (
    <html
      lang={styling.general.language}
      data-theme={styling.theme}
      className={`${styling.general.html} ${activeFontClass}`}
      suppressHydrationWarning
    >
      {children}
    </html>
  );
}
