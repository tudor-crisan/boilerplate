import Link from "next/link";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";

export default function HeaderMenu() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  return (
    <div className="space-x-4 max-md:hidden">
      {copywriting.SectionHeader.menus.map((menu, index) => (
        <Link href={menu.path} key={index} className={styling.links[0]}>
          {menu.label}
        </Link>
      ))}
    </div>
  )
}