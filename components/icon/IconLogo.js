"use client";
import { useEffect, useState } from "react";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import shuffle from "@/libs/shuffle";
import logos from "@/lists/logos";

export default function IconLogo() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  const defaultShape = logos[visual.logo.shape];
  const [logoSettings, setLogoSettings] = useState(defaultShape);

  const shuffleLogo = () => {
    if (shuffle.logo.isEnabled) {
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
    <div className={`${styling.components.element} ${visual.logo.container} inline-flex items-center justify-center`}>
      <svg
        className={visual.logo.svg.classname}
        viewBox={visual.logo.svg.viewbox}
        fill={visual.logo.svg.fill}
        stroke={visual.logo.svg.stroke}
        strokeWidth={visual.logo.svg.strokewidth}
        strokeLinecap={visual.logo.svg.strokelinecap}
        strokeLinejoin={visual.logo.svg.strokelinejoin}
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