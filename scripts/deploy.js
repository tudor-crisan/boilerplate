import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const BOILERPLATE_DIR = path.resolve(__dirname, '..');
const DEPLOYED_ROOT = 'C:/twain_32/deployed'; // Adjust if needed
// List of folders in DEPLOYED_ROOT to deploy to. 
// If empty, it could potentially scan the directory, but for safety, please list them.
// Example: ['my-app', 'another-app']
const TARGET_FOLDERS = [
  'loyalboards',
  'tudorcrisan.dev'
];

// Configuration for app-specific folders to KEEP.
// Standardizes "tudorcrisan" (folder) vs "tudorcrisan.dev" (target)
const APP_CONFIG = {
  'loyalboards': ['loyalboards'],
  'tudorcrisan.dev': ['tudorcrisan', 'tudorcrisan.dev']
};

const EXCLUDED_FILES = [
  '.next',
  'node_modules',
  '.vscode',
  '.env',
  'env',
  '.git', // Always exclude .git from source copy to avoid overwriting target repo
  'scripts', // Maybe exclude scripts too? User didn't specify, but often good practice. Keeping as per request: only .next, node_modules, .vscode, .env
  'todo.notes.txt',
  'README.md',
  '.env.example',
  '.editorconfig'
];

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
      if (entry.name === 'next.config.mjs') {
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
    if (entry === '.git') continue;
    const fullPath = path.join(dir, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

// Helper to filter lists/*.js files to only include relevant app content
function filterListFiles(targetDir, appName) {
  const listsDir = path.join(targetDir, 'lists');
  if (!fs.existsSync(listsDir)) return;

  const allowedApps = APP_CONFIG[appName] || [appName];
  const files = fs.readdirSync(listsDir);

  console.log(`   🧹 Filtering list files for ${appName}...`);

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(listsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const newLines = [];
    const forbiddenVars = new Set();

    // State for apps.js object filtering
    let isSkippingBlock = false;
    let blockBraceCount = 0;

    for (const line of lines) {
      // 1. Handle apps.js object keys
      if (file === 'apps.js') {
        const keyMatch = line.match(/^\s*["']?([\w-]+)["']?:\s*\{/);
        if (keyMatch) {
          const key = keyMatch[1];
          const standardProps = ['copywriting', 'styling', 'visual', 'setting', 'paths'];
          if (!standardProps.includes(key) && !allowedApps.includes(key)) {
            isSkippingBlock = true;
            blockBraceCount = 0;
          }
        }

        if (isSkippingBlock) {
          // Track braces to know when block ends
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          blockBraceCount += (openBraces - closeBraces);

          if (blockBraceCount <= 0) {
            isSkippingBlock = false;
          }
          continue;
        }
      }

      // 2. Handle Imports or loadJSON calls pointing to other apps
      // Regex looks for paths like: .../data/apps/appName/... or .../components/apps/appName/...
      const appPathMatch = line.match(/(?:data|components|public)\/apps\/([^/]+)\//);
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

    fs.writeFileSync(filePath, newLines.join('\n'));
  }
}

// Helper to remove unrelated app folders from specific directories
function cleanAppSpecificFiles(targetDir, appName) {
  const allowedApps = APP_CONFIG[appName] || [];

  // Directories that contain app-specific subfolders
  const directoriesToClean = [
    'public/apps',
    'data/apps',
    'components/apps'
  ];

  console.log(`   🧹 Cleaning app-specific files for ${appName} (Allowing: ${allowedApps.join(', ')})...`);

  for (const relativeDir of directoriesToClean) {
    const fullDir = path.join(targetDir, relativeDir);

    if (!fs.existsSync(fullDir)) continue;

    const entries = fs.readdirSync(fullDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // If the folder name is NOT in the allowed list for this app, delete it.
      if (!allowedApps.includes(entry.name)) {
        const entryPath = path.join(fullDir, entry.name);
        console.log(`      Running rmSync on ${relativeDir}/${entry.name}`);
        fs.rmSync(entryPath, { recursive: true, force: true });
      }
    }
  }
}

async function main() {
  try {
    // 1. Bump Version in package.json
    const packageJsonPath = path.join(BOILERPLATE_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const currentVersion = packageJson.version;
    const versionParts = currentVersion.split('.').map(Number);
    versionParts[2] += 1;
    const newVersion = versionParts.join('.');

    console.log(`ℹ️  Current version: ${currentVersion}`);
    console.log(`✅ Bumping version to: ${newVersion}`);

    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

    // 1b. Commit and Push Source Repo (Boilerplate)
    console.log(`\n💾 Committing and pushing source repo (${newVersion})...`);
    try {
      const sourceExecOptions = { cwd: BOILERPLATE_DIR, stdio: 'inherit' };
      execSync('git add .', sourceExecOptions);
      execSync(`git commit -am "${newVersion}"`, sourceExecOptions);
      execSync('git push', sourceExecOptions);
      console.log(`   ✅ Source repo updated.`);
    } catch (e) {
      console.error(`   ❌ Source repo git operations failed:`, e.message);
    }

    if (TARGET_FOLDERS.length === 0) {
      console.warn('⚠️  No target folders defined in scripts/deploy.js. Please update TARGET_FOLDERS array.');
      // Optionally scan directory if user prefers, but safety first.
    }

    // 2. Process each target
    for (const folder of TARGET_FOLDERS) {
      const targetDir = path.join(DEPLOYED_ROOT, folder);

      if (!fs.existsSync(targetDir)) {
        console.warn(`⚠️  Target directory not found: ${targetDir}. Skipping...`);
        continue;
      }

      console.log(`\n🚀 Deploying to ${folder}...`);

      // Clean target
      console.log('   🧹 Cleaning target directory...');
      cleanDir(targetDir);

      // Copy files
      console.log('   📂 Copying files...');
      copyDir(BOILERPLATE_DIR, targetDir, EXCLUDED_FILES);

      // Filter app-specific files
      cleanAppSpecificFiles(targetDir, folder);

      // Filter list files to remove refs to other apps
      filterListFiles(targetDir, folder);



      // Git operations
      console.log('   💾 Committing and pushing target...');
      try {
        const execOptions = { cwd: targetDir, stdio: 'inherit' };
        execSync('git add .', execOptions);
        execSync(`git commit -am "${newVersion}"`, execOptions);
        execSync('git push', execOptions);
        console.log(`   ✅ Deployed ${folder}`);
      } catch (e) {
        console.error(`   ❌ Git operations failed for ${folder}:`, e.message);
      }
    }

    console.log('\n✨ Deployment complete!');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

main();
