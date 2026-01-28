import fs from "fs";
import path from "path";

const IGNORED_DIRS = [
  "node_modules",
  "coverage",
  ".git",
  ".next",
  "dist",
  "build",
  ".vscode",
];

function cleanEmptyFolders(folder) {
  let isDir = false;
  try {
    const stats = fs.statSync(folder);
    isDir = stats.isDirectory();
  } catch {
    // Ignore invalid paths
    return;
  }

  if (!isDir) {
    return;
  }

  // Check valid subfolders
  let files = [];
  try {
    files = fs.readdirSync(folder);
  } catch {
    console.error(`Error reading ${folder}:`, e);
    return;
  }

  if (files.length > 0) {
    files.forEach((file) => {
      const fullPath = path.join(folder, file);

      // Check if ignored
      if (IGNORED_DIRS.includes(file)) {
        // Do not enter ignored directories
        return;
      }

      cleanEmptyFolders(fullPath);
    });

    // Re-evaluate files after cleaning subfolders
    try {
      files = fs.readdirSync(folder);
    } catch {
      // failed to re-read
    }
  }

  if (files.length === 0) {
    // It's empty (or became empty)
    const baseName = path.basename(folder);
    // Don't delete the root folder if it happens to be passed
    if (baseName !== ".") {
      try {
        fs.rmdirSync(folder);
        console.log(`Deleted empty folder: ${folder}`);
      } catch (e) {
        console.error(`Error deleting ${folder}:`, e);
      }
    }
  }
}

// Start from current directory
console.log("Starting clean up of empty folders...");
cleanEmptyFolders(".");
console.log("Done.");
