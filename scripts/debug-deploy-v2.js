
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const listsDir = path.resolve(__dirname, '../lists');

const APP_CONFIG = {
  'loyalboards': ['loyalboards'],
};

function testFilter(appName) {
  console.log(`\n=== Testing filter for app: ${appName} ===`);
  const allowedApps = APP_CONFIG[appName] || [appName];

  const files = ['apps.js', 'settings.node.js'];

  for (const file of files) {
    const filePath = path.join(listsDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }

    console.log(`\n>>> Processing ${file}...`);
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
          // Fix: Don't filter inner properties like copywriting/styling
          const standardProps = ['copywriting', 'styling', 'visual', 'setting', 'paths'];
          if (!standardProps.includes(key) && !allowedApps.includes(key)) {
            isSkippingBlock = true;
            // reset brace count for new block
            blockBraceCount = 0;
            console.log(`   [-BLOCK START] Skipping block for key: ${key}`);
          } else {
            console.log(`   [+KEEP KEY] Key: ${key}`);
          }
        }

        if (isSkippingBlock) {
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          blockBraceCount += (openBraces - closeBraces);

          if (blockBraceCount <= 0) {
            isSkippingBlock = false;
            console.log(`   [-BLOCK END] Block closed.`);
          }
          continue;
        }
      }

      // 2. Handle Imports or loadJSON calls pointing to other apps
      const appPathMatch = line.match(/data\/apps\/([^/]+)\//);
      if (appPathMatch) {
        const folderName = appPathMatch[1];
        if (!allowedApps.includes(folderName)) {
          console.log(`   [-PATH] Removing ref to ${folderName}: ${line.trim()}`);
          const importVarMatch = line.match(/import\s+(\w+)\s+from/);
          if (importVarMatch) {
            forbiddenVars.add(importVarMatch[1]);
          }
          continue;
        }
      }

      // 3. Handle usages of forbidden variables
      let containsForbidden = false;
      for (const badVar of forbiddenVars) {
        if (new RegExp(`\\b${badVar}\\b`).test(line)) {
          containsForbidden = true;
          console.log(`   [-VAR] Removing usage of ${badVar}: ${line.trim()}`);
          break;
        }
      }
      if (containsForbidden) {
        continue;
      }

      newLines.push(line);
    }

    console.log(`\n--- OUTPUT START (${file}) ---`);
    console.log(newLines.join('\n'));
    console.log(`--- OUTPUT END (${file}) ---\n`);
  }
}

testFilter('loyalboards');
