import Link from "next/link";
import SvgBack from "@/components/svg/SvgBack";
import { defaultStyling as styling } from "@/libs/defaults";

export default function ButtonBack({ url = "/", className = "" }) {
  return (
    <Link href={url} className={`${styling.roundness[0]} ${styling.shadows[0]} btn ${className}`}>
      <SvgBack />
      Back
    </Link>
  )
}