import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import Link from "next/link";
import LogoIcon from "@/components/base/LogoIcon";
import styling from "@/config/styling.json";

export default function SectionHeader() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.general.wrapper} flex justify-between items-center px-4 py-2`}>
        <div className="flex items-center gap-2">
          {styling.logo.showLogo && (
            <LogoIcon />
          )}
          {styling.logo.showText && (
            <span className="font-bold">
              {copywriting.SectionHeader.name}
            </span>
          )}
        </div>
        <div className="space-x-4 max-md:hidden">
          {copywriting.SectionHeader.menus.map((menu, index) => (
            <Link href={menu.path} key={index} className={styling.links[0]}>
              {menu.label}
            </Link>
          ))}
        </div>
        <div>
          <ButtonLogin isLoggedIn={false} />
        </div>
      </div>
    </section>
  );
}