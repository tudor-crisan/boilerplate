"use client";
import { useStyling } from "@/components/context/ContextStyling";
import Image from "next/image";

export default function HeroImage() {
  const { styling } = useStyling();
  return (
    <div className={styling.SectionHero.HeroImage.container}>
      <Image
        src={styling.SectionHero.HeroImage.image.src}
        alt={styling.SectionHero.HeroImage.image.alt}
        className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.SectionHero.HeroImage.classname}`}
        width={styling.SectionHero.HeroImage.image.width}
        height={styling.SectionHero.HeroImage.image.height}
      />
    </div>
  )
}