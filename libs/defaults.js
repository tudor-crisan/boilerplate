import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/apps.js";
import visuals from "@/lists/visuals";
import settings from "@/lists/settings";
import { deepMerge } from "@/libs/utils.client";

const { copywriting, styling, visual, setting } = apps[process.env.NEXT_PUBLIC_APP];

const getMergedConfig = (configType, configValue, list) => {
  let baseKey = `${configType}0`;
  let overrideKey = null;

  if (typeof configValue === "string") {
    overrideKey = configValue;
  } else if (typeof configValue === "object") {
    baseKey = configValue.default || baseKey;
    overrideKey = configValue.override;
  }

  const base = list[baseKey] || {};
  const override = overrideKey ? list[overrideKey] : {};

  return deepMerge(base, override);
};

export const defaultCopywriting = getMergedConfig("copywriting", copywriting, copywritings);
export const defaultStyling = getMergedConfig("styling", styling, stylings);
export const defaultVisual = getMergedConfig("visual", visual, visuals);
export const defaultSetting = getMergedConfig("setting", setting, settings);
