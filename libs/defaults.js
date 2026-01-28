import { getMergedConfig, getMergedConfigWithModules } from "@/libs/merge.mjs";
import apps from "@/lists/applications.mjs";
import boards from "@/lists/boards.js";
import copywritings from "@/lists/copywritings.js";
import settings from "@/lists/settings.js";
import stylings from "@/lists/stylings.js";
import visuals from "@/lists/visuals.js";
import authData from "@/modules/auth/data/auth.json";
import blogData from "@/modules/blog/data/modules/blog.json";
import blogs from "@/modules/blog/lists/blogs.js";
import helpData from "@/modules/help/data/help.json";
import helps from "@/modules/help/lists/helps.js";

const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
const {
  copywriting,
  styling,
  visual,
  setting,
  blog,
  help,
  details = {},
} = apps[appName] || {};

const allSettings = {
  ...settings,
  ...boards,
  auth: authData,
  help: helpData,
  blog: blogData,
};

export const defaultCopywriting = getMergedConfig(
  "copywriting",
  copywriting,
  copywritings,
);

// Inject details into copywriting
if (defaultCopywriting.SectionHero) {
  if (details.title) defaultCopywriting.SectionHero.headline = details.title;
  if (details.description)
    defaultCopywriting.SectionHero.paragraph = details.description;
}

export const defaultStyling = getMergedConfig("styling", styling, stylings);

export const defaultVisual = getMergedConfig("visual", visual, visuals);

// Inject details into visual
if (details.favicon) {
  if (!defaultVisual.favicon) defaultVisual.favicon = {};
  defaultVisual.favicon.href = details.favicon;
}

export const defaultSetting = getMergedConfigWithModules(
  "setting",
  setting,
  allSettings,
);

// Inject details into setting
if (details.appName) defaultSetting.appName = details.appName;
if (details.website) defaultSetting.website = details.website;

export const defaultBlog = getMergedConfig("blog", blog, blogs);
export const defaultHelp = getMergedConfig("help", help, helps);
export const appStyling = styling?.override
  ? stylings[styling.override]
  : defaultStyling;

// Deep merge paths from modules
defaultSetting.paths = {
  ...defaultSetting.paths,
  ...authData?.paths,
  ...helpData?.paths,
  ...blogData?.paths,
  ...boards?.paths,
};

// Deep merge rateLimits from modules
defaultSetting.rateLimits = {
  ...defaultSetting.rateLimits,
  ...authData?.rateLimits,
  ...helpData?.rateLimits,
  ...blogData?.rateLimits,
  ...boards?.rateLimits,
};

// Deep merge metadata from modules
defaultSetting.metadata = {
  ...defaultSetting.metadata,
  ...authData?.metadata,
  ...helpData?.metadata,
  ...blogData?.metadata,
  ...boards?.metadata,
};

// Merge auth settings
defaultSetting.auth = {
  ...defaultSetting.auth,
  ...authData?.auth,
};
