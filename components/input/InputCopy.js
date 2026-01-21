"use client";
import Button from "@/components/button/Button";
import ButtonCopy from "@/components/button/ButtonCopy";
import Tooltip from "@/components/common/Tooltip";
import SvgExternal from "@/components/svg/SvgExternal";
import { useStyling } from "@/context/ContextStyling";

export default function InputCopy({
  value = "",
  openUrl = null,
  tooltipCopy = "",
  tooltipOpen = "",
}) {
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.components.input_copy} ${styling.general.element} `}
    >
      <p className="truncate mr-auto">{value}</p>
      <div className={`${styling.flex.items_center} gap-2 shrink-0 ml-4`}>
        <Tooltip text={tooltipCopy}>
          <ButtonCopy copyText={value} />
        </Tooltip>
        {openUrl && (
          <Tooltip text={tooltipOpen}>
            <Button
              href={openUrl}
              target="_blank"
              variant="btn-neutral btn-square"
              noAutoLoading={true}
            >
              <SvgExternal size="size-5" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
