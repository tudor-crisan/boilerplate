"use client";
import { useStyling } from "@/components/context/ContextStyling";
import Image from "next/image";

export default function HeroImage() {
  const { styling } = useStyling();
  return (
    <div className={styling.SectionHero.image.wrapper}>
      <Image
        src={styling.SectionHero.image.path}
        alt={styling.SectionHero.image.alt}
        className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.SectionHero.image.style}`}
        width={styling.SectionHero.image.width}
        height={styling.SectionHero.image.height}
      />
    </div>
  )
}