import Button from "@/components/button/Button";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";

export default function HeaderMenu() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  return (
    <div className="space-x-4 max-md:hidden">
      {copywriting.SectionHeader.menus.map((menu, index) => (
        <Button href={menu.path} key={index} variant="btn-ghost shadow-none!">
          {menu.label}
        </Button>
      ))}
    </div>
  )
}