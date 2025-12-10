import copywriting from "@/config/copywriting.json";
import menus from "@/config/menus.json";
import ButtonLogin from "../button/ButtonLogin";
import Link from "next/link";

export default function SectionTop() {
  const { appName } = copywriting.SectionTop;
  const { topMenus } = menus;

  return (
    <section className="bg-base-200">
      <div>{appName}</div>
      <div>
        {topMenus.map((menu, index) => (
          <Link href={menu.path} key={index}>
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