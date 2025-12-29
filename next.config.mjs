import dotenv from "dotenv";
import apps from "./lists/apps.js";
import settings from "./lists/settings.node.js";
import { getMergedConfig } from "./libs/merge.js";

// Load env file based on app name
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: `env/env-dev/.env.dev.${process.env.APP}` });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    const app = process.env.NEXT_PUBLIC_APP;
    const { setting } = apps[app] || {};

    if (!setting) return [];

    const appSettings = getMergedConfig("setting", setting, settings);
    const paths = appSettings?.pages?.paths;

    return paths ? Object.values(paths) : [];
  },
};

export default nextConfig;
