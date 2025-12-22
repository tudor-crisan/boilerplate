"use client";
import SvgCopy from "@/components/svg/SvgCopy";
import Button from "@/components/button/Button";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

export default function ButtonCopy({ copyText = "" }) {
  const { copy } = useCopyToClipboard();

  return (
    <Button
      variant="btn-neutral btn-square"
      onClick={() => copy(copyText)}
    >
      <SvgCopy />
    </Button>
  )
}