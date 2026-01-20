import {
  BlogSchema,
  BoardsSchema,
  CopywritingSchema,
  SettingSchema,
  StylingSchema,
  VisualSchema,
} from "@/types";
import fs from "fs";
import path from "path";
import { z } from "zod";

// Mapping of module names to their corresponding schemas
const SCHEMA_MAP: Record<string, z.ZodTypeAny> = {
  blog: BlogSchema.partial(),
  boards: BoardsSchema.partial(),
  copywriting: CopywritingSchema.partial(),
  setting: SettingSchema.partial(),
  styling: StylingSchema.partial(),
  visual: VisualSchema.partial(),
};

const DATA_DIR = path.join(process.cwd(), "data");
const MODULES_DIR = path.join(DATA_DIR, "modules");
const APPS_DIR = path.join(DATA_DIR, "apps");

function validateFile(filePath: string, schema: z.ZodTypeAny) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);
    const result = schema.safeParse(json);

    if (!result.success) {
      console.error(`❌ Validation failed for: ${filePath}`);
      // Format error messages strictly
      if (result.error && result.error.issues) {
        result.error.issues.forEach((err) => {
          console.error(`  - Path: ${err.path.join(".")}`);
          console.error(`    Message: ${err.message}`);
        });
      } else {
        console.error("  - Unknown validation error occurred.");
      }
      return false;
    } else {
      console.log(`✅ Validated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } catch (err) {
    console.error(`❌ Error reading/parsing file: ${filePath}`);
    console.error(err);
    return false;
  }
}

function processModules() {
  if (!fs.existsSync(MODULES_DIR)) return;

  const files = fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const moduleName = path.basename(file, ".json");
    const schema = SCHEMA_MAP[moduleName];
    if (!schema) {
      console.warn(`⚠️ No schema found for module file: ${file}`);
      continue;
    }

    validateFile(path.join(MODULES_DIR, file), schema);
  }
}

function processApps() {
  if (!fs.existsSync(APPS_DIR)) return;

  const apps = fs.readdirSync(APPS_DIR);
  for (const appName of apps) {
    const appPath = path.join(APPS_DIR, appName);
    if (!fs.statSync(appPath).isDirectory()) continue;

    const files = fs.readdirSync(appPath).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      // Logic to determine schema based on filename suffix
      // e.g. lb0_blog.json -> blog schema

      let matched = false;
      for (const [moduleName, schema] of Object.entries(SCHEMA_MAP)) {
        if (file.toLowerCase().includes(moduleName)) {
          validateFile(path.join(appPath, file), schema);
          matched = true;
          break;
        }
      }

      if (!matched) {
        console.warn(`⚠️ Could not match schema for app file: ${file}`);
      }
    }
  }
}

console.log("🚀 Starting Data Validation...");
processModules();
processApps();
console.log("🏁 Validation Complete.");
