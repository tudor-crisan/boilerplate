import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const appsDataDir = path.join(rootDir, "data", "apps");
const modulesDataDir = path.join(rootDir, "data", "modules");
const listsDir = path.join(rootDir, "lists");

const CONFIG_TYPES = [
  "copywriting",
  "styling",
  "visual",
  "setting",
  "blog",
  "boards",
  "help",
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
    if (fs.existsSync(moduleFile)) {
      configurations[type][type] = `@/data/modules/${type}.json`;
      allConfigsForNode[type] = `../data/modules/${type}.json`;
    }
  });

  const appManifest = {};

  apps.forEach((app) => {
    appManifest[app] = {};
    CONFIG_TYPES.forEach((type) => {
      const appConfigFile = path.join(appsDataDir, app, `${type}.json`);
      if (fs.existsSync(appConfigFile)) {
        const configId = `${app}_${type}`;
        configurations[type][configId] = `@/data/apps/${app}/${type}.json`;
        allConfigsForNode[configId] = `../data/apps/${app}/${type}.json`;

        const moduleFile = path.join(modulesDataDir, `${type}.json`);
        appManifest[app][type] = {
          default: fs.existsSync(moduleFile) ? `${type}` : undefined,
          override: configId,
        };
      }
    });
  });

  // Write individual list files
  CONFIG_TYPES.forEach((type) => {
    let content = "/* eslint-disable */\n";
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
  const appManifestContent = `/* eslint-disable */\nconst applications = ${JSON.stringify(appManifest, null, 2)};\n\nexport default applications;\n`;
  safeWrite(path.join(listsDir, "applications.mjs"), appManifestContent);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("🚀 Generating application lists...");
  generateLists();
  console.log("🏁 Done.");
}
