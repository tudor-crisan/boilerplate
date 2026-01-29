"use client";
import Button from "@/modules/general/components/button/Button";
import ButtonCopy from "@/modules/general/components/button/ButtonCopy";
import Tooltip from "@/modules/general/components/common/Tooltip";
import SvgExternal from "@/modules/general/components/svg/SvgExternal";
import { useStyling } from "@/modules/general/context/ContextStyling";

export default function InputCopy({
  value = "",
  openUrl = null,
  tooltipCopy = "",
  tooltipOpen = "",
  children,
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
        {children}
      </div>
    </div>
  );
}
