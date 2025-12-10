import copywriting from "@/config/copywriting.json";
import menus from "@/config/menus.json";
import ButtonLogin from "../button/ButtonLogin";
import Link from "next/link";
import Image from "next/image";
import styling from "@/config/styling.json";

export default function SectionTop() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.top.positioning} px-4 py-2`}>
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt={copywriting.SectionTop.appName} width="32" height="32" />
          <span className="font-bold">{copywriting.SectionTop.appName}</span>
        </div>
        <div className="space-x-4 max-md:hidden">
          {menus.topMenus.map((menu, index) => (
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