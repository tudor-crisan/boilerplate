"use client";
import { useStyling } from "@/context/ContextStyling";
import toast from "react-hot-toast";
import SvgCopy from "@/components/svg/SvgCopy";

export default function ButtonCopy({ copyText = "" }) {
  const { styling } = useStyling();

  const copyLink = () => {
    navigator.clipboard.writeText(copyText);
    toast.success("Copied to clipboard!");
  };

  return (
    <button
      className={`${styling.roundness[0]} ${styling.shadows[0]} btn-sm sm:btn-md btn btn-neutral btn-square`}
      onClick={copyLink}
    >
      <SvgCopy />
    </button>
  )
}