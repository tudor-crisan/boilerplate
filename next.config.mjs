import dotenv from "dotenv";
import apps from "./lists/apps.js";
import settings from "./lists/settings.node.js";

// Load env file based on app name
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: `env/.env.${process.env.APP}` });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    const app = process.env.NEXT_PUBLIC_APP;
    const settingKey = apps[app]?.setting;

    if (!settingKey) return [];

    const paths = settings[settingKey]?.pages?.paths
    return paths ? Object.values(paths) : [];
  },
};

export default nextConfig;
