"use client";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

const ProfileImage = ({ src, initials, size = "md", className }) => {
  const { styling } = useStyling();

  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-12 text-base",
    lg: "size-16 text-2xl",
    xl: "size-24 text-3xl"
  };

  // Extract base component style from json if available, or fallback
  const baseStyle = styling.components?.element || "";

  return (
    <div className={cn("relative overflow-hidden shrink-0", sizeClasses[size], baseStyle, className)}>
      {src ? (
        <img
          src={src}
          alt="Profile image"
          className={`w-full h-full object-cover ${baseStyle}`}
        />
      ) : (
        <div className={`w-full h-full bg-primary text-primary-content ${styling.flex.center} font-extrabold uppercase select-none`}>
          {initials || "?"}
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
