"use client";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import shuffle from "@/libs/shuffle";
import logos from "@/lists/logos";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  };

  useEffect(() => {
    window.addEventListener("shuffle-logo", shuffleLogo);
    return () => window.removeEventListener("shuffle-logo", shuffleLogo);
  }, []);

  return (
    <Link
      href="/"
      title="Home"
      className={`${styling.components.element} ${visual.logo.container} ${styling.flex.inline_center}`}
    >
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
          <circle
            key={circleIndex}
            cx={circle[0]}
            cy={circle[1]}
            r={circle[2]}
          />
        ))}
        {logoSettings.rect.map((rect, rectIndex) => (
          <rect
            key={rectIndex}
            x={rect[0]}
            y={rect[1]}
            width={rect[2]}
            height={rect[3]}
            rx={rect[4]}
          />
        ))}
      </svg>
    </Link>
  );
}
