import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/apps.js";
import visuals from "@/lists/visuals";
import settings from "@/lists/settings";
import blogs from "@/lists/blogs";
import { getMergedConfig, getMergedConfigWithModules } from "@/libs/merge";

const { copywriting, styling, visual, setting, blog } = apps[process.env.NEXT_PUBLIC_APP];

export const defaultCopywriting = getMergedConfig("copywriting", copywriting, copywritings);
export const defaultStyling = getMergedConfig("styling", styling, stylings);
export const defaultVisual = getMergedConfig("visual", visual, visuals);
export const defaultSetting = getMergedConfigWithModules("setting", setting, settings);
export const defaultBlog = getMergedConfig("blog", blog, blogs);
export const appStyling = stylings[styling.override];
