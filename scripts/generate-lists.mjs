import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const appsDataDir = path.join(rootDir, "apps");
const modulesDataDir = path.join(rootDir, "modules", "general", "data");
const listsDir = path.join(rootDir, "modules", "general", "lists");

const CONFIG_TYPES = [
  "copywriting",
  "styling",
  "visual",
  "setting",
  "blog",
  "boards",
  "help",
  "video",
];

function getAppDirs() {
  if (!fs.existsSync(appsDataDir)) return [];
  return fs
    .readdirSync(appsDataDir)
    .filter((f) => fs.statSync(path.join(appsDataDir, f)).isDirectory());
}

export function generateLists(options = {}) {
  const log = (msg) => {
    if (!options.silent) console.log(msg);
  };

  const safeWrite = (filePath, content) => {
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, "utf8");
      if (existing === content) return;
    }
    fs.writeFileSync(filePath, content);
    log(`✅ Generated lists/${path.basename(filePath)}`);
  };

  const apps = getAppDirs();
  const configurations = {};
  const allConfigsForNode = {};

  CONFIG_TYPES.forEach((type) => {
    configurations[type] = {};
    // Add default modules
    const moduleFile = path.join(modulesDataDir, `${type}.json`);
    const subModuleFile = path.join(
      rootDir,
      "modules",
      type,
      "data",
      `${type}.json`,
    );
    if (fs.existsSync(moduleFile)) {
      configurations[type][type] = `@/modules/general/data/${type}.json`;
      allConfigsForNode[type] = `../data/${type}.json`;
    } else if (fs.existsSync(subModuleFile)) {
      configurations[type][type] = `@/modules/${type}/data/${type}.json`;
      allConfigsForNode[type] = `../../../modules/${type}/data/${type}.json`;
    }
  });

  const appManifest = {};

  const submitterDataPath = path.join(
    rootDir,
    "extensions",
    "submitter",
    "data.json",
  );
  const submitterData = fs.existsSync(submitterDataPath)
    ? JSON.parse(fs.readFileSync(submitterDataPath, "utf8"))
    : {};

  apps.forEach((app) => {
    appManifest[app] = {};
    const appSettingFile = path.join(appsDataDir, app, `setting.json`);
    const appSetting = fs.existsSync(appSettingFile)
      ? JSON.parse(fs.readFileSync(appSettingFile, "utf8"))
      : {};
    const appSubmitterData = submitterData[app] || {};

    // Populate details from setting.json and submitter data
    appManifest[app].details = {
      appName: appSubmitterData.name || appSetting.appName || "",
      website: appSubmitterData.url || appSetting.website || "",
      title: appSubmitterData.keywords || appSetting.seo?.tagline || "",
      description:
        appSubmitterData.description || appSetting.seo?.description || "",
      favicon: appSetting.seo?.image || "", // Use SEO image as fallback for favicon or similar
    };

    CONFIG_TYPES.forEach((type) => {
      const appConfigFile = path.join(appsDataDir, app, `${type}.json`);
      if (fs.existsSync(appConfigFile)) {
        const configId = `${app}_${type}`;
        configurations[type][configId] = `@/apps/${app}/${type}.json`;
        allConfigsForNode[configId] = `../../../apps/${app}/${type}.json`;

        // Check for module file in data/ or modules/
        const rootModuleFile = path.join(modulesDataDir, `${type}.json`);
        const subModuleFile = path.join(
          rootDir,
          "modules",
          type,
          "data",
          `${type}.json`,
        );
        const moduleExists =
          fs.existsSync(rootModuleFile) || fs.existsSync(subModuleFile);

        appManifest[app][type] = {
          default: moduleExists ? `${type}` : undefined,
          override: configId,
        };
      }
    });
  });

  // Write individual list files
  CONFIG_TYPES.forEach((type) => {
    let content = "";
    const entries = Object.entries(configurations[type]);

    // Sort alphabetically by path to satisfy potential manual inspection
    entries.sort((a, b) => a[1].localeCompare(b[1]));

    entries.forEach(([id, filePath]) => {
      content += `import ${id} from "${filePath}";\n`;
    });

    content += `\nconst ${type}s = {\n`;
    entries.forEach(([id]) => {
      content += `  ${id},\n`;
    });
    content += `};\n\nexport default ${type}s;\n`;

    const fileName = type.endsWith("s") ? `${type}.js` : `${type}s.js`;
    safeWrite(path.join(listsDir, fileName), content);
  });

  // Write settings.node.mjs with all collected configs
  let nodeContent = `import fs from "fs";\nimport path from "path";\nimport { fileURLToPath } from "url";\n\n`;
  nodeContent += `const __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n\n`;
  nodeContent += `const loadJSON = (p) => {\n  const fullPath = path.join(__dirname, p);\n  try {\n    if (!fs.existsSync(fullPath)) return {};\n    return JSON.parse(fs.readFileSync(fullPath, "utf8"));\n  } catch (e) {\n    return {};\n  }\n};\n\n`;
  nodeContent += `const settings = {\n`;
  Object.entries(allConfigsForNode).forEach(([id, filePath]) => {
    nodeContent += `  ${id}: loadJSON("${filePath}"),\n`;
  });
  nodeContent += `};\n\nexport default settings;\n`;
  safeWrite(path.join(listsDir, "settings.node.mjs"), nodeContent);

  // Write applications.mjs
  const appManifestContent = `const applications = ${JSON.stringify(appManifest, null, 2)};\n\nexport default applications;\n`;
  safeWrite(path.join(listsDir, "applications.mjs"), appManifestContent);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("🚀 Generating application lists...");
  generateLists();
  console.log("🏁 Done.");
}
