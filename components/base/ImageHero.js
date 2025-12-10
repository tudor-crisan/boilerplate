import styling from "@/config/styling.json";
import Image from "next/image";

export default function ImageHero() {
  const { path, alt, style, width, height } = styling.SectionHero.image;
  return (
    <Image
      src={path}
      alt={alt}
      className={style}
      width={width}
      height={height}
    />
  )
}