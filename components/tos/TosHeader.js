"use client";
import HeaderBack from "@/components/header/HeaderBack";
import { defaultSetting as settings } from "@/libs/defaults";
import { usePathname } from "next/navigation";

export default function TosHeader() {
  const pathname = usePathname();

  // Check if we are on a help article page (e.g. /tos/help/article-id or /help/article-id)
  // We check both the source (rewrite) and destination (actual path)
  const isHelpArticle =
    (pathname?.startsWith(settings.paths.help?.source) &&
      pathname !== settings.paths.help?.source) ||
    (pathname?.startsWith(settings.paths.help?.destination) &&
      pathname !== settings.paths.help?.destination);

  const backUrl = isHelpArticle
    ? settings.paths.help?.source
    : settings.paths.home?.source;

  return <HeaderBack backUrl={backUrl} />;
}
