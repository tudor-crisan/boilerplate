import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import Link from "next/link";
import LogoIcon from "@/components/base/LogoIcon";
import styling from "@/config/styling.json";

export default function SectionHeader() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} flex justify-between items-center px-4 py-2`}>
        <div className="flex items-center gap-2">
          {styling.logo.showLogo && (
            <LogoIcon />
          )}
          <span className="font-bold">
            {copywriting.SectionHeader.appName}
          </span>
        </div>
        <div className="space-x-4 max-md:hidden">
          {copywriting.SectionHeader.menus.map((menu, index) => (
            <Link href={menu.path} key={index} className="link link-hover">
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