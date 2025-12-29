import dotenv from "dotenv";
import apps from "./lists/apps.js";
import settings from "./lists/settings.node.js";

// Load env file based on app name
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: `env/env-dev/.env.dev.${process.env.APP}` });
}

// Helper functions to replicate libs/defaults.js logic
const deepMerge = (target, source) => {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = output[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
};

const getMergedConfig = (configValue, list) => {
  let baseKey = 'setting0';
  let overrideKey = null;

  if (typeof configValue === "string") {
    overrideKey = configValue;
  } else if (typeof configValue === "object") {
    baseKey = configValue.default || baseKey;
    overrideKey = configValue.override;
  }

  const base = list[baseKey] || {};
  const override = overrideKey ? list[overrideKey] : {};

  return deepMerge(base, override);
};

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

    const appSettings = getMergedConfig(setting, settings);
    const paths = appSettings?.pages?.paths;

    return paths ? Object.values(paths) : [];
  },
};

export default nextConfig;
