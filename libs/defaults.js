import settings from "@/config/settings.json";
import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/apps.js";

const { copywriting, styling } = apps[settings.app];

export const defaultCopywriting = copywritings[copywriting];
export const defaultStyling = stylings[styling];
