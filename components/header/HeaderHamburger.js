import Link from "next/link";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useState } from "react";
import HeaderButton from "@/components/header/HeaderButton";
import { useVisual } from "@/context/ContextVisual";
import SvgHamburger from "@/components/svg/SvgHamburger";
import SvgClose from "@/components/svg/SvgClose";
import IconLogo from "@/components/icon/IconLogo";
import { defaultSetting as settings } from "@/libs/defaults";

export default function HeaderHamburger() {
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();
  const [isOpen, setIsOpen] = useState(false);

  // If no menus defined, don't render anything
  if (!copywriting.SectionHeader.menus || copywriting.SectionHeader.menus.length === 0) {
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
        <div className="fixed inset-0 z-50 bg-base-100 flex flex-col p-4 sm:hidden animate-fade-in-up overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <IconLogo />
              {visual.show.SectionHeader.appName && (
                <span className="font-bold text-md">
                  {settings.appName}
                </span>
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
          <div className="flex flex-col gap-4 items-center w-full">
            {copywriting.SectionHeader.menus.map((menu, index) => (
              <Link
                href={menu.path}
                key={index}
                className="btn btn-ghost text-lg w-full"
                onClick={toggleMenu}
              >
                {menu.label}
              </Link>
            ))}
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
