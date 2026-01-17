import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/applications.mjs";
import visuals from "@/lists/visuals.js";
import settings from "@/lists/settings.js";
import blogs from "@/lists/blogs.js";
import { getMergedConfig, getMergedConfigWithModules } from "@/libs/merge.mjs";

const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
const { copywriting, styling, visual, setting, blog } = apps[appName] || {};

export const defaultCopywriting = getMergedConfig("copywriting", copywriting, copywritings);
export const defaultStyling = getMergedConfig("styling", styling, stylings);
export const defaultVisual = getMergedConfig("visual", visual, visuals);
export const defaultSetting = getMergedConfigWithModules("setting", setting, settings);
export const defaultBlog = getMergedConfig("blog", blog, blogs);
export const appStyling = stylings[styling.override];
