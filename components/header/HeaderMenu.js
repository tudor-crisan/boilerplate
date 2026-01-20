import Link from "next/link";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";

export default function HeaderMenu() {
  const { copywriting } = useCopywriting();
  const { styling } = useStyling();

  // If no menus defined, don't render anything
  if (!copywriting.SectionHeader.menus || copywriting.SectionHeader.menus.length === 0) {
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
        <div className="dropdown dropdown-end dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className={`${styling.components.element} btn btn-ghost shadow-none!`}
          >
            Help
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {copywriting.SectionFooter.menus
              .find((m) => m.title === "Support")
              ?.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}