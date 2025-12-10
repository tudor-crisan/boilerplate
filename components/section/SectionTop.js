import copywriting from "@/config/copywriting.json";
import menus from "@/config/menus.json";
import ButtonLogin from "../button/ButtonLogin";
import Link from "next/link";
import styling from "@/config/styling.json";

export default function SectionTop() {
  return (
    <section className="bg-base-200">
      <div className={`${styling.section.wrapper} ${styling.section.positioning} px-4 py-2`}>
        <div className="font-bold">
          {copywriting.SectionTop.appName}
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