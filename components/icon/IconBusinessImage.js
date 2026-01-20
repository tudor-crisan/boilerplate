"use client";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";
import { cn } from "@/libs/utils.client";
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
