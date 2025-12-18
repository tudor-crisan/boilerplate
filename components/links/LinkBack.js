import Link from "next/link";
import SvgBack from "@/components/svg/SvgBack";

export default function LinkBack({ className }) {
  return (
    <div className={`${className} text-center mx-auto`}>
      <Link href="/" className="link link-hover text-sm flex gap-2">
        <SvgBack />
        Back
      </Link>
    </div>
  )
}