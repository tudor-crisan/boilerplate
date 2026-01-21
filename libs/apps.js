import { formatWebsiteUrl } from "@/libs/utils.server.js";
import apps from "@/lists/applications.mjs";
import copywritings from "@/lists/copywritings.js";
import settings from "@/lists/settings.js";
import stylings from "@/lists/stylings.js";
import visuals from "@/lists/visuals.js";

export const getAppDetails = (appName) => {
  const appConfig = apps[appName];
  if (!appConfig) return null;

  // Resolve keys
  const resolveKey = (configItem) => {
    if (typeof configItem === "string") return configItem;
    return configItem.override || configItem.default;
  };

  const copyKey = resolveKey(appConfig.copywriting);
  const settingKey = resolveKey(appConfig.setting);
  const visualKey = resolveKey(appConfig.visual);
  const stylingKey = resolveKey(appConfig.styling);

  // Fetch data
  const copywriting = copywritings[copyKey];
  const setting = settings[settingKey];
  const visual = visuals[visualKey];
  const styling = stylings[stylingKey];

  if (!copywriting || !setting || !visual || !styling) return null;

  return {
    copywriting,
    setting,
    visual,
    styling,

    title: copywriting.SectionHero?.headline || "",
    description: copywriting.SectionHero?.paragraph || "",
    favicon: visual.favicon?.href || "",

    appName: setting.appName || "",
    website: formatWebsiteUrl(setting.website || ""),
  };
};
