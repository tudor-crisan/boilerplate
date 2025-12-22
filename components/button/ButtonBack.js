import Link from "next/link";
import SvgBack from "@/components/svg/SvgBack";
import { defaultStyling as styling } from "@/libs/defaults";

export default function ButtonBack({ url = "/", className = "", disabled = false }) {
  return (
    <Link
      href={url}
      disabled={disabled}
      className={`${styling.roundness[0]} btn-sm sm:btn-md btn ${className}`}
    >
      <SvgBack />
      Back
    </Link>
  )
}