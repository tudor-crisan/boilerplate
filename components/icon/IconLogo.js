"use client";
import { useEffect, useState } from "react";
import { useStyling } from "@/components/context/ContextStyling";
import settings from "@/config/settings.json";
import logos from "@/libs/logos";

export default function IconLogo() {
  const { styling } = useStyling();
  const defaultSettings = styling.logo.svg;
  const [logoSettings, setLogoSettings] = useState(defaultSettings);

  const shuffleLogo = () => {
    if (settings.shuffle.logo.isEnabled) {
      const shuffleLogo = localStorage.getItem("shuffle-logo") || "";
      if (shuffleLogo && logos[shuffleLogo]) {
        setLogoSettings(logos[shuffleLogo]);
        return;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("shuffle-logo", shuffleLogo);
    return () => window.removeEventListener("shuffle-logo", shuffleLogo);
  }, []);

  return (
    <div className={`${styling.logo.wrapperStyle} ${styling.roundness[0]} ${styling.shadows[0]} inline-flex items-center justify-center`}>
      <svg
        className={styling.logo.svgStyle}
        viewBox={styling.logo.viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={styling.logo.stroke.width}
        strokeLinecap={styling.logo.stroke.linecap}
        strokeLinejoin={styling.logo.stroke.linejoin}
      >
        {logoSettings.path.map((d, dIndex) => (
          <path key={dIndex} d={d} />
        ))}
        {logoSettings.circle.map((circle, circleIndex) => (
          <circle key={circleIndex} cx={circle[0]} cy={circle[1]} r={circle[2]} />
        ))}
        {logoSettings.rect.map((rect, rectIndex) => (
          <rect key={rectIndex} x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]} rx={rect[4]} />
        ))}
      </svg>
    </div>
  );
}