import styling from "@/config/styling.json";
import Image from "next/image";

export default function ImageHero() {
  return (
    <Image
      src={styling.SectionHero.image.path}
      alt={styling.SectionHero.image.alt}
      className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.SectionHero.image.style}`}
      width={styling.SectionHero.image.width}
      height={styling.SectionHero.image.height}
    />
  )
}