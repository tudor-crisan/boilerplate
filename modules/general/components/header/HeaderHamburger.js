"use client";
import Popover from "@/modules/general/components/common/Popover";
import HeaderButton from "@/modules/general/components/header/HeaderButton";
import IconLogo from "@/modules/general/components/icon/IconLogo";
import SvgClose from "@/modules/general/components/svg/SvgClose";
import SvgHamburger from "@/modules/general/components/svg/SvgHamburger";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderHamburger() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // If no menus defined, don't render anything
  if (
    !copywriting.SectionHeader.menus ||
    copywriting.SectionHeader.menus.length === 0
  ) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className="btn btn-square btn-ghost"
          aria-label="Open menu"
        >
          <SvgHamburger className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 bg-base-100 ${styling.flex.col} p-4 sm:hidden animate-fade-in-up overflow-y-auto`}
        >
          <div className={`${styling.flex.between} mb-8`}>
            <div className={`${styling.flex.items_center} gap-2`}>
              <IconLogo />
              {visual.show.SectionHeader.appName && (
                <span className="font-bold text-md">{settings.appName}</span>
              )}
            </div>
            <button
              onClick={toggleMenu}
              className="btn btn-square btn-ghost"
              aria-label="Close menu"
            >
              <SvgClose className="w-8 h-8" />
            </button>
          </div>
          <div className={`${styling.flex.col} gap-4 items-center w-full`}>
            {copywriting.SectionHeader.menus.map((menu, index) => (
              <Link
                href={menu.path}
                key={index}
                className="btn btn-ghost text-lg w-full"
              >
                {menu.label}
              </Link>
            ))}

            {/* Mobile Help Menu */}
            <Popover
              label="Help"
              items={
                copywriting.SectionFooter.menus.find(
                  (m) => m.title === "Support",
                )?.links || []
              }
            />
            {visual.show.SectionHeader.button && (
              <div className="mt-4">
                <HeaderButton />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
