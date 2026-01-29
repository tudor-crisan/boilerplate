import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `https://${settings.website}/sitemap.xml`,
  };
}
