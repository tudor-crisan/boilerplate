import apps from "./lists/apps.js";
import settings from "./lists/settings.node.js";

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

    return settings[settingKey]?.pages?.paths ?? [];
  },
};

export default nextConfig;
