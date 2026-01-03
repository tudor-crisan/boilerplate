
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const listsDir = path.resolve(__dirname, '../lists');

const APP_CONFIG = {
  'loyalboards': ['loyalboards'],
  'tudorcrisan.dev': ['tudorcrisan', 'tudorcrisan.dev']
};

function testFilter(appName) {
  console.log(`\n--- Testing filter for app: ${appName} ---`);
  const allowedApps = APP_CONFIG[appName] || [appName];

  const files = ['settings.node.js', 'apps.js', 'copywritings.js']; // relevant files

  for (const file of files) {
    const filePath = path.join(listsDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }

    console.log(`\nProcessing ${file}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const newLines = [];
    const forbiddenVars = new Set();

    let isSkippingBlock = false;
    let blockBraceCount = 0;

    for (const line of lines) {
      // 1. Handle apps.js object keys
      if (file === 'apps.js') {
        const keyMatch = line.match(/^\s*["']?([\w-]+)["']?:\s*\{/);
        if (keyMatch) {
          const key = keyMatch[1];
          if (!allowedApps.includes(key)) {
            isSkippingBlock = true;
            // reset brace count for new block
            blockBraceCount = 0;
          }
        }

        if (isSkippingBlock) {
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          blockBraceCount += (openBraces - closeBraces);

          // Log skipped line for debugging
          // console.log(`  Skipping block line: ${line.trim()}`);

          if (blockBraceCount <= 0) {
            isSkippingBlock = false;
          }
          continue;
        }
      }

      // 2. Handle Imports or loadJSON calls pointing to other apps
      const appPathMatch = line.match(/data\/apps\/([^/]+)\//);
      if (appPathMatch) {
        const folderName = appPathMatch[1];
        if (!allowedApps.includes(folderName)) {
          console.log(`  Skipping path ref: ${line.trim()} (App: ${folderName})`);
          const importVarMatch = line.match(/import\s+(\w+)\s+from/);
          if (importVarMatch) {
            forbiddenVars.add(importVarMatch[1]);
            console.log(`    -> Added forbidden var: ${importVarMatch[1]}`);
          }
          continue;
        }
      }

      // 3. Handle usages of forbidden variables
      let containsForbidden = false;
      for (const badVar of forbiddenVars) {
        if (new RegExp(`\\b${badVar}\\b`).test(line)) {
          containsForbidden = true;
          console.log(`  Skipping usage of ${badVar}: ${line.trim()}`);
          break;
        }
      }
      if (containsForbidden) {
        continue;
      }

      newLines.push(line);
    }

    console.log(`--- Result Preview for ${file} ---`);
    console.log(newLines.join('\n'));
    console.log(`-----------------------------------`);
  }
}

testFilter('loyalboards');
