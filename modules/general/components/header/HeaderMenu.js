"use client";
import Dropdown from "@/modules/general/components/common/Dropdown";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import Link from "next/link";

export default function HeaderMenu() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  // If no menus defined, don't render anything
  if (
    !copywriting.SectionHeader.menus ||
    copywriting.SectionHeader.menus.length === 0
  ) {
    return null;
  }

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden sm:flex gap-2">
        {copywriting.SectionHeader.menus.map((menu, index) => (
          <Link
            href={menu.path}
            key={index}
            className={`${styling.components.element} btn btn-ghost shadow-none!`}
          >
            {menu.label}
          </Link>
        ))}

        {/* Help Dropdown */}
        <Dropdown
          label="Help"
          items={
            copywriting.SectionFooter.menus.find((m) => m.title === "Support")
              ?.links || []
          }
        />
      </div>
    </>
  );
}
