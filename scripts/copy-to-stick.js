import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, '..');
const DEST_DIR = 'E:\\sources\\dlmanifests\\microsoft-windows-wmi-core\\wrm\\boilerplate';

console.log('--- Copy Script Started ---');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Destination: ${DEST_DIR}`);

// Check if source exists
if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Error: Source directory does not exist: ${SOURCE_DIR}`);
  process.exit(1);
}

// 1. Clean Destination
if (fs.existsSync(DEST_DIR)) {
  console.log('Cleaning destination directory...');
  try {
    // Remove the directory and its contents
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
    console.log('Destination cleaned.');
  } catch (err) {
    console.error('Error cleaning destination:', err);
    process.exit(1);
  }
} else {
  console.log('Destination directory does not exist, skipping clean step.');
}

// 2. Perform Copy
console.log('Copying files...');
try {
  fs.cpSync(SOURCE_DIR, DEST_DIR, {
    recursive: true,
    filter: (src, dest) => {
      const basename = path.basename(src);
      // Filter out specific directories
      if (['.git', '.next', 'node_modules'].includes(basename)) {
        return false;
      }
      return true;
    }
  });
  console.log('Copy completed successfully!');
} catch (err) {
  console.error('Error during copy:', err);
  process.exit(1);
}
