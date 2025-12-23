"use client";
import Link from "next/link";
import { useCopywriting } from "@/context/ContextCopywriting";

export default function FooterMenu() {
  const { copywriting } = useCopywriting();

  return (
    <>
      {copywriting.SectionFooter.menus.map((menu, index) => (
        <div key={index} className="flex flex-col gap-2">
          <h3 className="font-bold text-base-content/90">{menu.title}</h3>
          <div className="flex flex-col gap-1 text-sm text-base-content/70">
            {menu.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
