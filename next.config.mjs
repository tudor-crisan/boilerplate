import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-load environment variables based on APP
const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
if (appName) {
  const envPath = path.join(__dirname, "env", "env-dev", `.env.dev.${appName}`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
    console.log(`Loaded environment from: ${envPath}`);
  }
}

// Load dynamic settings for the active app
let appSettings = {};
if (appName) {
  try {
    const { default: apps } = await import("./lists/applications.mjs");
    const { default: settings } = await import("./lists/settings.node.mjs");
    const { getMergedConfigWithModules } = await import("./libs/merge.mjs");

    const appConfig = apps[appName];
    const setting = appConfig?.setting;

    if (setting) {
      appSettings = getMergedConfigWithModules("setting", setting, settings);

      // Load module data for server-side config
      const loadJSON = (p) => {
        try {
          return JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf8"));
        } catch (e) {
          return {};
        }
      };

      const authData = loadJSON("modules/auth/data/auth.json");
      const helpData = loadJSON("modules/help/data/help.json");
      const blogData = loadJSON("modules/blog/data/modules/blog.json");
      const boardsData = loadJSON("modules/boards/data/boards.json");

      // Deep merge paths specifically for rewrites
      appSettings.paths = {
        ...appSettings.paths,
        ...authData?.paths,
        ...helpData?.paths,
        ...blogData?.paths,
        ...boardsData?.paths,
      };
    }
  } catch (error) {
    console.error("Failed to load app settings:", error.message);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },

  async rewrites() {
    if (!appName) {
      console.warn("APP or NEXT_PUBLIC_APP not defined");
      return [];
    }

    const paths = appSettings?.paths || {};
    const returnPaths = Object.values(paths).filter((path) => {
      return (
        path && typeof path === "object" && path.source && path.destination
      );
    });

    console.log("Rewrites loaded:", returnPaths.length);
    return returnPaths;
  },

  serverExternalPackages: ["mongoose"],

  // Use dynamic maxUploadSize from settings
  experimental: {
    serverActions: {
      bodySizeLimit:
        appSettings?.forms?.general?.config?.maxUploadSize?.label?.toLowerCase() ||
        "1mb",
    },
  },
};

export default nextConfig;
