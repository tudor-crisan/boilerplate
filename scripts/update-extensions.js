import applications from "@/lists/applications.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTENSION_DIR = path.resolve(__dirname, "../extensions/submitter");
const DATA_FILE = path.join(EXTENSION_DIR, "data.json");

// Transform applications object into extension format
const extensionData = {};

Object.entries(applications).forEach(([key, config]) => {
  const details = config.details;
  if (details) {
    extensionData[key] = {
      name: details.appName,
      url: details.website.startsWith("http")
        ? details.website
        : `https://${details.website}`,
      description: details.description,
      keywords: details.title, // Using title as initial keywords/tagline
    };
  }
});

fs.writeFileSync(DATA_FILE, JSON.stringify(extensionData, null, 2));

console.log(`✅ Extension data synced to ${DATA_FILE}`);
console.log(
  `   Generated profiles for: ${Object.keys(extensionData).join(", ")}`,
);
