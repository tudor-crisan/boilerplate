import Link from "next/link";
import SvgBack from "@/components/svg/SvgBack";

export default function ButtonBack({ url = "" }) {
  return (
    <Link href={url} className="btn">
      <SvgBack />
      Back
    </Link>
  )
}