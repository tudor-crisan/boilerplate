import Link from "next/link";
import SvgBack from "@/components/svg/SvgBack";

export default function ButtonBack({ url = "/", className = "" }) {
  return (
    <Link href={url} className={`btn ${className}`}>
      <SvgBack />
      Back
    </Link>
  )
}