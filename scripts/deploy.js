import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const BOILERPLATE_DIR = path.resolve(__dirname, "..");
const CONFIG_PATH = path.resolve(
  __dirname,
  "..",
  "data",
  "modules",
  "deploy.json",
);

// Load external config
let CONFIG;
try {
  CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
} catch {
  console.error(
    "❌ Failed to load scripts/deploy.json. Please ensure it exists.",
  );
  process.exit(1);
}

const DEPLOYED_ROOT = CONFIG.defaults.deployedRoot || "C:/twain_32/deployed";
const TARGET_FOLDERS = CONFIG.defaults.targetFolders || [];
// Always exclude .git if not present in config, just in case
const EXCLUDED_FILES = CONFIG.defaults.excludedFiles || [".git"];

// Helper to copy directory recursively with exclusions
function copyDir(src, dest, exclusions) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Stricter exclusion: check if the exact name is in the list
    if (exclusions.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclusions);
    } else {
      fs.copyFileSync(srcPath, destPath);
      // Optional: verbose log for critical files to reassure user
      if (entry.name === "next.config.mjs") {
        console.log(`      ✅ Copied next.config.mjs`);
      }
    }
  }
}

// Helper to clean directory but keep .git
function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry === ".git") continue;
    const fullPath = path.join(dir, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

// Helper to filter lists/*.js files to only include relevant app content
function filterListFiles(targetDir, appName) {
  const listsDir = path.join(targetDir, "lists");
  if (!fs.existsSync(listsDir)) return;

  const appConfig = CONFIG.apps[appName] || {};
  const allowedApps = appConfig.allowedApps || [appName];
  const files = fs.readdirSync(listsDir);

  console.log(`   🧹 Filtering list files for ${appName}...`);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.join(listsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const newLines = [];
    const forbiddenVars = new Set();

    // State for apps.js object filtering
    let isSkippingBlock = false;
    let blockBraceCount = 0;

    for (const line of lines) {
      // 1. Handle apps.js object keys
      if (file === "apps.js") {
        const keyMatch = line.match(/^\s*["']?([\w-]+)["']?:\s*\{/);
        if (keyMatch) {
          const key = keyMatch[1];
          const standardProps = [
            "copywriting",
            "styling",
            "visual",
            "setting",
            "paths",
          ];
          if (!standardProps.includes(key) && !allowedApps.includes(key)) {
            isSkippingBlock = true;
            blockBraceCount = 0;
          }
        }

        if (isSkippingBlock) {
          // Track braces to know when block ends
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          blockBraceCount += openBraces - closeBraces;

          if (blockBraceCount <= 0) {
            isSkippingBlock = false;
          }
          continue;
        }
      }

      // 2. Handle Imports or loadJSON calls pointing to other apps
      // Regex looks for paths like: .../data/apps/appName/... or .../components/apps/appName/...
      const appPathMatch = line.match(
        /(?:data|components|public)\/apps\/([^/]+)\//,
      );
      if (appPathMatch) {
        const folderName = appPathMatch[1];
        if (!allowedApps.includes(folderName)) {
          // This line references an excluded app. Skip it.
          // If it's an import, capture the var name.
          const importVarMatch = line.match(/import\s+(\w+)\s+from/);
          if (importVarMatch) {
            forbiddenVars.add(importVarMatch[1]);
          }
          continue;
        }
      }

      // 3. Handle usages of forbidden variables (e.g. in export objects)
      // Check if line contains literal match of forbidden var
      let containsForbidden = false;
      for (const badVar of forbiddenVars) {
        // Precise word check
        if (new RegExp(`\\b${badVar}\\b`).test(line)) {
          containsForbidden = true;
          break;
        }
      }
      if (containsForbidden) {
        continue;
      }

      newLines.push(line);
    }

    fs.writeFileSync(filePath, newLines.join("\n"));
  }
}

// Helper to remove unrelated app folders from specific directories
function cleanAppSpecificFiles(targetDir, appName) {
  const appConfig = CONFIG.apps[appName] || {};
  const allowedApps = appConfig.allowedApps || [];
  const publicAppsException = appConfig.publicAppsException || [];

  // Directories that contain app-specific subfolders
  const directoriesToClean = ["public/apps", "data/apps", "components/apps"];

  console.log(
    `   🧹 Cleaning app-specific files for ${appName} (Allowing: ${allowedApps.join(", ")})...`,
  );

  for (const relativeDir of directoriesToClean) {
    const fullDir = path.join(targetDir, relativeDir);

    if (!fs.existsSync(fullDir)) continue;

    const entries = fs.readdirSync(fullDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // If the folder name is NOT in the allowed list for this app, delete it.
      if (!allowedApps.includes(entry.name)) {
        // EXCEPTION: Check publicAppsException
        if (
          relativeDir === "public/apps" &&
          publicAppsException.includes(entry.name)
        ) {
          console.log(
            `      Found public/apps/${entry.name}, preserving it (shared assets).`,
          );
          continue;
        }

        const entryPath = path.join(fullDir, entry.name);
        console.log(`      Running rmSync on ${relativeDir}/${entry.name}`);
        fs.rmSync(entryPath, { recursive: true, force: true });
      }
    }
  }

  // Remove webhooks based on config
  if (appConfig.removeResend) {
    const resendDir = path.join(targetDir, "app/api/resend");
    if (fs.existsSync(resendDir)) {
      console.log(`      Running rmSync on app/api/resend`);
      fs.rmSync(resendDir, { recursive: true, force: true });
    }
  }

  // Remove specific paths defined in app config (pathsToRemove or modulesToRemove)
  const pathsToRemove = new Set(appConfig.pathsToRemove || []);
  
  if (appConfig.modulesToRemove && CONFIG.modules) {
    appConfig.modulesToRemove.forEach(moduleName => {
      const modulePaths = CONFIG.modules[moduleName];
      if (modulePaths) {
        modulePaths.forEach(p => pathsToRemove.add(p));
      } else {
        console.warn(`      ⚠️  Module "${moduleName}" not found in CONFIG.modules.`);
      }
    });
  }

  for (const relativePath of pathsToRemove) {
    const fullPath = path.join(targetDir, relativePath);
    if (fs.existsSync(fullPath)) {
      console.log(`      App-specific removal: ${relativePath}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

// Helper to configure vercel.json specific to the app
function configureVercelJson(targetDir, appName) {
  const vercelPath = path.join(targetDir, "vercel.json");
  let vercelConfig = {};

  // Read existing valid json or start fresh
  if (fs.existsSync(vercelPath)) {
    try {
      vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf-8"));
    } catch {
      console.warn(
        "   ⚠️ Invalid vercel.json found, starting with empty object.",
      );
      vercelConfig = {};
    }
  }

  const appConfig = CONFIG.apps[appName];
  if (appConfig && appConfig.vercelConfig) {
    console.log(`   ⚙️ Configuring vercel.json for ${appName}...`);
    Object.assign(vercelConfig, appConfig.vercelConfig);
    fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));
  }
}

// Helper to remove specific dependencies from package.json
function cleanPackageJson(targetDir) {
  const packageJsonPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) return;

  console.log("   🧹 Cleaning package.json dependencies...");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const dependenciesToRemove = CONFIG.defaults.dependenciesToRemove || [];

  let modified = false;

  if (packageJson.scripts) {
    const allowedScripts = ["build", "start"];
    Object.keys(packageJson.scripts).forEach((script) => {
      if (!allowedScripts.includes(script)) {
        delete packageJson.scripts[script];
        modified = true;
      }
    });
  }

  ["dependencies", "devDependencies"].forEach((depType) => {
    if (packageJson[depType]) {
      dependenciesToRemove.forEach((dep) => {
        if (packageJson[depType][dep]) {
          console.log(`      Removing ${dep} from ${depType}`);
          delete packageJson[depType][dep];
          modified = true;
        }
      });
    }
  });

  if (modified) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
    );
  }
}

async function main() {
  try {
    // 0. Parse arguments
    const args = process.argv.slice(2);
    const shouldIncrement = !args.includes("--no-bump");

    // 1. Bump Version in package.json
    const packageJsonPath = path.join(BOILERPLATE_DIR, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const currentVersion = packageJson.version;
    let newVersion = currentVersion;

    if (shouldIncrement) {
      const versionParts = currentVersion.split(".").map(Number);
      versionParts[2] += 1;
      newVersion = versionParts.join(".");

      console.log(`ℹ️  Current version: ${currentVersion}`);
      console.log(`✅ Bumping version to: ${newVersion}`);

      packageJson.version = newVersion;
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n",
      );
    } else {
      console.log(`ℹ️  Current version: ${currentVersion}`);
      console.log(`⚠️  Skipping version bump (--no-bump flag detected)`);
    }

    // 1b. Commit and Push Source Repo (Boilerplate)
    console.log(`\n💾 Committing and pushing source repo (${newVersion})...`);
    try {
      const sourceExecOptions = { cwd: BOILERPLATE_DIR, stdio: "inherit" };
      execSync("git add .", sourceExecOptions);
      execSync(`git commit -am "${newVersion}"`, sourceExecOptions);
      execSync("git push", sourceExecOptions);
      console.log(`   ✅ Source repo updated.`);
    } catch (e) {
      console.error(`   ❌ Source repo git operations failed:`, e.message);
    }

    if (TARGET_FOLDERS.length === 0) {
      console.warn(
        "⚠️  No target folders defined in deploy.json. Please update the configuration.",
      );
    }

    // 2. Process each target
    for (const folder of TARGET_FOLDERS) {
      const targetDir = path.join(DEPLOYED_ROOT, folder);

      if (!fs.existsSync(targetDir)) {
        console.warn(
          `⚠️  Target directory not found: ${targetDir}. Skipping...`,
        );
        continue;
      }

      console.log(`\n🚀 Deploying to ${folder}...`);

      // Clean target
      console.log("   🧹 Cleaning target directory...");
      cleanDir(targetDir);

      // Copy files
      console.log("   📂 Copying files...");
      copyDir(BOILERPLATE_DIR, targetDir, EXCLUDED_FILES);

      // Filter app-specific files
      cleanAppSpecificFiles(targetDir, folder);

      // Remove specific global removal paths from all deployments
      const pathsToRemove = CONFIG.defaults.pathsToRemoveFromAll || [];
      for (const relativePath of pathsToRemove) {
        const fullPath = path.join(targetDir, relativePath);
        if (fs.existsSync(fullPath)) {
          console.log(`   🧹 Removing ${relativePath}...`);
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
      }

      // Filter list files to remove refs to other apps
      filterListFiles(targetDir, folder);

      // Configure vercel.json (inject cron, etc)
      configureVercelJson(targetDir, folder);

      // Clean package.json
      cleanPackageJson(targetDir);

      // Git operations
      console.log("   💾 Committing and pushing target...");
      try {
        const execOptions = { cwd: targetDir, stdio: "inherit" };
        execSync("git add .", execOptions);
        execSync(`git commit -am "${newVersion}"`, execOptions);
        execSync("git push", execOptions);
        console.log(`   ✅ Deployed ${folder}`);
      } catch (e) {
        console.error(`   ❌ Git operations failed for ${folder}:`, e.message);
      }
    }

    console.log("\n✨ Deployment complete!");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main();
