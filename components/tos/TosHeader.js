"use client";
import { usePathname } from "next/navigation";
import ButtonBack from "@/components/button/ButtonBack";
import HeaderTop from "@/components/header/HeaderTop";
import WrapperHeader from "@/components/wrapper/WrapperHeader";
import { defaultSetting as settings } from "@/libs/defaults";

export default function TosHeader() {
  const pathname = usePathname();

  // Check if we are on a help article page (e.g. /tos/help/article-id or /help/article-id)
  // We check both the source (rewrite) and destination (actual path)
  const isHelpArticle = (
    (pathname?.startsWith(settings.paths.help.source) && pathname !== settings.paths.help.source) ||
    (pathname?.startsWith(settings.paths.help.destination) && pathname !== settings.paths.help.destination)
  );

  const backUrl = isHelpArticle ? settings.paths.help.source : settings.paths.home.source;

  return (
    <section id="header" className="bg-base-200">
      <WrapperHeader className="bg-base-200">
        <HeaderTop url={settings.paths.home.source} />
        <ButtonBack url={backUrl} />
      </WrapperHeader>
    </section>
  );
}