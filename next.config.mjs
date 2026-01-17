/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    const app = process.env.NEXT_PUBLIC_APP;

    if (!app) {
      console.warn("NEXT_PUBLIC_APP not defined");
      return [];
    }

    try {
      // Dynamic imports to isolate load issues
      const { default: apps } = await import("./lists/apps.js");
      const { default: settings } = await import("./lists/settings.node.js");
      const { getMergedConfigWithModules } = await import("./libs/merge.js");

      const appConfig = apps[app];
      const setting = appConfig?.setting;

      if (!setting) {
        console.warn("No setting for app:", app);
        return [];
      }

      const appSettings = getMergedConfigWithModules("setting", setting, settings);
      const paths = appSettings?.paths || {};

      const returnPaths = Object.values(paths).filter(path => {
        return path && typeof path === 'object' && path.source && path.destination;
      });

      console.log("Rewrites loaded:", returnPaths.length);
      return returnPaths;
    } catch (error) {
      console.error("Rewrites error:", error.message);
      return [];
    }
  }
};

export default nextConfig;
