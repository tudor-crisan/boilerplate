import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useState } from "react";
import HeaderButton from "@/components/header/HeaderButton";
import { useVisual } from "@/context/ContextVisual";
import SvgHamburger from "@/components/svg/SvgHamburger";
import SvgClose from "@/components/svg/SvgClose";
import SvgChevronRight from "@/components/svg/SvgChevronRight";
import IconLogo from "@/components/icon/IconLogo";
import { defaultSetting as settings } from "@/libs/defaults";

export default function HeaderHamburger() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  const { visual } = useVisual();
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
        <div className={`fixed inset-0 z-50 bg-base-100 ${styling.flex.col} p-4 sm:hidden animate-fade-in-up overflow-y-auto`}>
          <div className={`${styling.flex.between} mb-8`}>
            <div className={`${styling.flex.items_center} gap-2`}>
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
          <div className={`${styling.flex.col} gap-4 items-center w-full`}>
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

            {/* Mobile Help Menu */}
            <div className="w-full flex flex-col items-center">
              <button
                className="btn btn-ghost text-lg w-full flex items-center justify-center gap-2"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
              >
                Help
                <SvgChevronRight
                  className={`w-5 h-5 transition-transform duration-200 ${isHelpOpen ? "rotate-90" : ""}`}
                />
              </button>

              {isHelpOpen && (
                <div className="flex flex-col gap-2 items-center w-full mt-2 animate-fade-in-up">
                  {copywriting.SectionFooter.menus
                    .find((m) => m.title === "Support")
                    ?.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="btn btn-ghost text-base w-full opacity-80 hover:opacity-100"
                        onClick={toggleMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
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
