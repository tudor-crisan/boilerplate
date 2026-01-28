import {
  deepMerge,
  getMergedConfig,
  getMergedConfigWithModules,
} from "@/libs/merge.mjs";
import apps from "@/lists/applications.mjs";
import boards from "@/lists/boards.js";
import copywritings from "@/lists/copywritings.js";
import settings from "@/lists/settings.js";
import stylings from "@/lists/stylings.js";
import visuals from "@/lists/visuals.js";
import authData from "@/modules/auth/data/auth.json";
import blogData from "@/modules/blog/data/blog.json";
import blogs from "@/modules/blog/lists/blogs.js";
import helpData from "@/modules/help/data/help.json";
import helps from "@/modules/help/lists/helps.js";

// Construct the Base Setting by merging Global Setting with Module Defaults
// Order: Modules -> Global Setting (Global wins if conflict, usually they are orthogonal)
// OR Global -> Modules?
// Usually Module Defaults are foundational. Global 'setting.json' is the project-wide config.
// So let's merge Modules INTO Global Setting.
// Note: boards import from lists/boards.js returns { boards: json }. We need the json.
const modulesBase = deepMerge(
  authData,
  deepMerge(helpData, deepMerge(blogData, boards.boards)),
);
const baseSetting = deepMerge(modulesBase, settings.setting);

// Update specific key in settings list to point to our enriched base
// This is a trick to make 'getMergedConfigWithModules' use our enriched object as the base.
// 'settings' import is an object { setting: ..., loyalboards_setting: ... }
const enrichedSettingsList = {
  ...settings,
  setting: baseSetting,
};

const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
const {
  copywriting,
  styling,
  visual,
  setting, // This is just the key/ref from lists/applications.mjs
  blog,
  help,
  details = {},
} = apps[appName] || {};

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

// Now getMergedConfigWithModules will use 'enrichedSettingsList'
// which contains our 'setting' key with the pre-merged module data.
// 'setting' variable here is likely { default: 'setting', override: 'loyalboards_setting' }
// So it picks up enrichedSettingsList['setting'] as base, and merged loyalboards_setting on top.
export const defaultSetting = getMergedConfigWithModules(
  "setting",
  setting,
  enrichedSettingsList,
);

// Inject details into setting
if (details.appName) defaultSetting.appName = details.appName;
if (details.website) defaultSetting.website = details.website;

export const defaultBlog = getMergedConfig("blog", blog, blogs);
export const defaultHelp = getMergedConfig("help", help, helps);
export const appStyling = styling?.override
  ? stylings[styling.override]
  : defaultStyling;
