import fs from 'fs';
import path from 'path';

const extensionsToFix = ['.js', '.mjs', '.cjs', '.json', '.md', '.css', '.html', '.txt', '.gitattributes'];
const skipDirs = ['.git', 'node_modules', '.next', 'coverage', 'dist', 'build'];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (skipDirs.includes(file)) return;
    
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (extensionsToFix.includes(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const rootDir = path.resolve('.');
console.log(`Scanning for files in ${rootDir}...`);

const files = getAllFiles(rootDir);
let fixedCount = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('\r\n')) {
      const newContent = content.replace(/\r\n/g, '\n');
      fs.writeFileSync(file, newContent, 'utf8');
      fixedCount++;
      // console.log(`Fixed CRLF -> LF: ${path.relative(rootDir, file)}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log(`\nVisited ${files.length} files.`);
console.log(`Converted ${fixedCount} files from CRLF to LF.`);
