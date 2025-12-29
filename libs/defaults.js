import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/apps.js";
import visuals from "@/lists/visuals";
import settings from "@/lists/settings";
import { deepMerge } from "@/libs/utils.client";

const { copywriting, styling, visual, setting } = apps[process.env.NEXT_PUBLIC_APP];

export const defaultCopywriting = deepMerge(copywritings.copywriting0, copywritings[copywriting]);
export const defaultStyling = stylings[styling];
export const defaultVisual = visuals[visual];
export const defaultSetting = deepMerge(settings.setting0, settings[setting]);
