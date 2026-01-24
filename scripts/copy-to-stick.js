import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOILERPLATE_DIR = path.resolve(__dirname, "..");
// Assuming 'boilerplate' and 'deployed' are siblings in the same root
const PROJECT_ROOT = path.resolve(BOILERPLATE_DIR, "..");

const DEST_ROOT = "E:\\sources\\dlmanifests\\microsoft-windows-wmi-core\\wrm";

const tasks = [
  {
    name: "Boilerplate",
    src: BOILERPLATE_DIR,
    dest: path.join(DEST_ROOT, "boilerplate"),
    type: "dir",
    filter: (src) => {
      const base = path.basename(src);
      return ![".git", ".next", "node_modules"].includes(base);
    },
  },
  {
    name: "Deployed",
    src: path.join(PROJECT_ROOT, "deployed"),
    dest: path.join(DEST_ROOT, "deployed"),
    type: "dir",
    filter: (src) => {
      const base = path.basename(src);
      return ![".git"].includes(base);
    },
  },
  {
    name: "Docs",
    src: path.join(PROJECT_ROOT, "docs.rtf"),
    dest: path.join(DEST_ROOT, "docs.rtf"),
    type: "file",
  },
];

console.log("--- Copy Script Started ---");
console.log(`Root: ${PROJECT_ROOT}`);
console.log(`Dest: ${DEST_ROOT}`);

for (const task of tasks) {
  console.log(`\n[${task.name}] Processing...`);

  // 1. Check Source
  if (!fs.existsSync(task.src)) {
    console.warn(`  Warning: Source not found at ${task.src}`);
    if (task.name === "Boilerplate") {
      console.error("  Critical: Boilerplate missing.");
      process.exit(1);
    }
    continue;
  }

  // 2. Clean Destination
  if (fs.existsSync(task.dest)) {
    console.log(`  Cleaning destination: ${task.dest}`);
    try {
      fs.rmSync(task.dest, { recursive: true, force: true });
    } catch (_e) {
      console.error(`  Error cleaning ${task.dest}:`, _e);
      process.exit(1);
    }
  }

  // 3. Copy
  console.log(`  Copying...`);
  try {
    if (task.type === "dir") {
      fs.cpSync(task.src, task.dest, {
        recursive: true,
        filter: (src) => task.filter(src),
      });
    } else {
      fs.copyFileSync(task.src, task.dest);
    }
    console.log(`  Success.`);
  } catch (_e) {
    console.error(`  Error copying ${task.name}:`, _e);
    process.exit(1);
  }
}

console.log("\n--- All Done ---");
