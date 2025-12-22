"use client";
import toast from "react-hot-toast";
import SvgCopy from "@/components/svg/SvgCopy";
import Button from "@/components/button/Button";

export default function ButtonCopy({ copyText = "" }) {
  const copyLink = () => {
    navigator.clipboard.writeText(copyText);
    toast.success("Copied to clipboard!");
  };

  return (
    <Button
      variant="btn-neutral btn-square"
      onClick={copyLink}
    >
      <SvgCopy />
    </Button>
  )
}