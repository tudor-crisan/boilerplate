"use client";
import { useStyling } from "@/context/ContextStyling";
import ButtonCopy from "@/components/button/ButtonCopy";
import Button from "@/components/button/Button";
import SvgExternal from "@/components/svg/SvgExternal";
import Tooltip from "@/components/common/Tooltip";
import useTooltip from "@/hooks/useTooltip";

export default function InputCopy({
  value = "",
  openUrl = null,
  tooltipCopy = "",
  tooltipOpen = ""
}) {
  const { styling } = useStyling();
  const copyTooltip = useTooltip();
  const openTooltip = useTooltip();

  return (
    <div className={`${styling.roundness[0]} ${styling.shadows[0]} bg-base-100 text-sm px-4 py-2 flex items-center max-w-96 w-full`}>
      <p className="truncate mr-auto">
        {value}
      </p>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <Tooltip text={tooltipCopy} isVisible={copyTooltip.isVisible}>
          <ButtonCopy
            copyText={value}
            onMouseEnter={copyTooltip.show}
            onMouseLeave={copyTooltip.hide}
          />
        </Tooltip>
        {openUrl && (
          <Tooltip text={tooltipOpen} isVisible={openTooltip.isVisible}>
            <Button
              href={openUrl}
              target="_blank"
              variant="btn-neutral btn-square"
              noAutoLoading={true}
              onMouseEnter={openTooltip.show}
              onMouseLeave={openTooltip.hide}
            >
              <SvgExternal size="size-5" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}