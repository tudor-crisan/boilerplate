"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { cn } from "@/modules/general/libs/utils.client";
import Image from "next/image";

const IconBusinessImage = ({ className, size = 32, ...props }) => {
  const { styling } = useStyling();

  if (!settings.business.logo) return null;

  return (
    <Image
      src={settings.business.logo}
      alt={settings.business.entity_name}
      width={size}
      height={size}
      className={cn(styling.components.element, className)}
      {...props}
    />
  );
};

export default IconBusinessImage;
