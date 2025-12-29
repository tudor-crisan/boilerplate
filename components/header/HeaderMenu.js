import Button from "@/components/button/Button";
import { useCopywriting } from "@/context/ContextCopywriting";

export default function HeaderMenu() {
  const { copywriting } = useCopywriting();

  return (
    <div className="max-sm:hidden">
      {copywriting.SectionHeader.menus.map((menu, index) => (
        <Button href={menu.path} key={index} variant="btn-ghost shadow-none!" noAutoLoading={true}>
          {menu.label}
        </Button>
      ))}
    </div>
  )
}