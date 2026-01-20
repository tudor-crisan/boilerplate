import { getMergedConfig, getMergedConfigWithModules } from "@/libs/merge.mjs";
import apps from "@/lists/applications.mjs";
import blogs from "@/lists/blogs.js";
import boards from "@/lists/boards.js";
import copywritings from "@/lists/copywritings.js";
import helps from "@/lists/helps.js";
import settings from "@/lists/settings.js";
import stylings from "@/lists/stylings.js";
import visuals from "@/lists/visuals.js";

const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
const { copywriting, styling, visual, setting, blog, help } = apps[appName] || {};

const allSettings = { ...settings, ...boards };

export const defaultCopywriting = getMergedConfig("copywriting", copywriting, copywritings);
export const defaultStyling = getMergedConfig("styling", styling, stylings);
export const defaultVisual = getMergedConfig("visual", visual, visuals);
export const defaultSetting = getMergedConfigWithModules("setting", setting, allSettings);
export const defaultBlog = getMergedConfig("blog", blog, blogs);
export const defaultHelp = getMergedConfig("help", help, helps);
export const appStyling = styling?.override ? stylings[styling.override] : defaultStyling;
