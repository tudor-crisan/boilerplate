"use client";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import Image from "next/image";

export default function HeroImage() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  return (
    <div className={visual.HeroImage.container}>
      <Image
        src={visual.HeroImage.image.src}
        alt={visual.HeroImage.image.alt}
        className={`${styling.components.card_featured} ${visual.HeroImage.classname}`}
        width={visual.HeroImage.image.width}
        height={visual.HeroImage.image.height}
      />
    </div>
  )
}