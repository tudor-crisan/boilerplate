"use client";
import SvgCopy from "@/components/svg/SvgCopy";
import Button from "@/components/button/Button";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

export default function ButtonCopy({ copyText = "" }) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="btn-neutral btn-square"
      disabled={isCopied}
      onClick={() => copy(copyText)}
    >
      <SvgCopy />
    </Button>
  )
}