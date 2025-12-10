import copywriting from "@/config/copywriting.json";
import menus from "@/config/menus.json";
import ButtonLogin from "../button/ButtonLogin";
import Link from "next/link";

export default function SectionTop() {
  const { appName } = copywriting.SectionTop;
  const { topMenus } = menus;

  return (
    <section className="bg-base-200 flex justify-between items-center px-4 py-2">
      <div className="font-bold">
        {appName}
      </div>
      <div className="space-x-4">
        {topMenus.map((menu, index) => (
          <Link href={menu.path} key={index} className="link link-hover">
            {menu.label}
          </Link>
        ))}
      </div>
      <div>
        <ButtonLogin isLoggedIn={false} />
      </div>
    </section>
  );
}