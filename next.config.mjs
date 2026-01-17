import apps from "./lists/apps.js";
import settings from "./lists/settings.node.js";
import { getMergedConfigWithModules } from "./libs/merge.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    const app = process.env.NEXT_PUBLIC_APP;

    if (!app) {
      console.warn("⚠️ NEXT_PUBLIC_APP is not defined. Skipping rewrites.");
      return [];
    }

    const { setting } = apps[app] || {};
    if (!setting) {
      console.warn(`⚠️ No settings found for app: ${app}`);
      return [];
    }

    try {
      const appSettings = getMergedConfigWithModules("setting", setting, settings);
      const paths = appSettings?.paths || {};

      const returnPaths = Object.values(paths).filter(path => {
        return path && typeof path === 'object' && path.source && path.destination;
      });

      console.log(`✅ Loaded ${returnPaths.length} rewrites for ${app}`);
      return returnPaths;
    } catch (error) {
      console.error("❌ Error generating rewrites:", error);
      return [];
    }
  }
};

export default nextConfig;
