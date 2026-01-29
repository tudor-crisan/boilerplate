import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function sitemap() {
  const baseUrl = `https://${settings.website}`;

  // Base routes only - no blog/help for this deployment
  const routes = ["", "/privacy", "/support", "/terms"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return routes;
}
