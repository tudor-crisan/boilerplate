import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateLists } from "./scripts/generate-lists.mjs";

// Ensure lists are up to date on startup
// generateLists({ silent: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-load environment variables based on APP 
const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
if (appName) {
  const envPath = path.join(__dirname, 'env', 'env-dev', `.env.dev.${appName}`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
    console.log(`Loaded environment from: ${envPath}`);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    const app = process.env.APP || process.env.NEXT_PUBLIC_APP;

    if (!app) {
      console.warn("APP or NEXT_PUBLIC_APP not defined");
      return [];
    }

    try {
      // Dynamic imports to isolate load issues
      const { default: apps } = await import("./lists/applications.mjs");
      const { default: settings } = await import("./lists/settings.node.mjs");
      const { getMergedConfigWithModules } = await import("./libs/merge.mjs");

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
      console.error("Rewrites error:", error.stack || error.message);
      return [];
    }
  }
};

export default nextConfig;
