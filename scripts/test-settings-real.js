import { deepMerge } from "../libs/merge.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJSON = (p) => JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf8"));

const setting0 = loadJSON("../data/modules/setting/setting0.json");
const lb0_setting = loadJSON("../data/apps/loyalboards/lb0_setting.json");

console.log("Merging settings...");
const merged = deepMerge(setting0, lb0_setting);

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
};

// Check Phase 1 Migrations (still valid)
assert(merged.auth.providers.length > 0, "Auth providers present");
assert(merged.rateLimits["post-create"], "Rate limits present");

// Check Phase 2 Migrations
// Business: "name" should be from setting0 (default) as it was removed from lb0_setting
assert(merged.business.name === "TudorCrisan.dev", "Business name loaded from default");
// Business: "socials" should be from lb0_setting (override/append) - wait, deepMerge overwrites arrays.
// setting0 has empty socials array. lb0_setting has populated socials array.
assert(merged.business.socials.length > 0, "Socials loaded from app override");
assert(merged.business.socials[0].name === "Twitter", "Socials content correct");

// Paths
assert(merged.pages.paths.previewEmail, "Preview Email path present (from default)");
assert(merged.pages.paths.billingSuccess, "Billing Success path present (from default)");

// Forms
assert(merged.forms.MockData, "MockData present (from default)");

console.log("Phase 2 migration verification passed!");
