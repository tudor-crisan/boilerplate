import { formatWebsiteUrl } from "@/modules/general/libs/utils.server.js";
import apps from "@/modules/general/lists/applications.mjs";

export const getAppDetails = (appName) => {
  const appConfig = apps[appName];
  if (!appConfig?.details) return null;

  const {
    title,
    description,
    favicon,
    website,
    appName: name,
  } = appConfig.details;

  return {
    title,
    description,
    favicon,
    appName: name,
    website: formatWebsiteUrl(website),
  };
};
