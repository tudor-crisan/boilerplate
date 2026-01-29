"use client";
import Button from "@/modules/general/components/button/Button";
import SvgCopy from "@/modules/general/components/svg/SvgCopy";
import useCopyToClipboard from "@/modules/general/hooks/useCopyToClipboard";

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
