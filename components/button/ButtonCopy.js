"use client";
import Button from "@/components/button/Button";
import SvgCopy from "@/components/svg/SvgCopy";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

export default function ButtonCopy({ copyText = "", ...props }) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="btn-neutral btn-square"
      disabled={isCopied}
      onClick={() => copy(copyText)}
      {...props}
    >
      <SvgCopy />
    </Button>
  );
}
