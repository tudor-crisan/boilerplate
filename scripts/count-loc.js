import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCLUDED_DIRS = [
    'node_modules',
    '.git',
    '.next',
    'specs',
    'tests',
    'public',
    'scripts' // requested to exclude its own folder usually, or at least keep it modular
];

const EXCLUDED_FILES = [
    'package-lock.json',
    '.gitignore',
    '.editorconfig',
    'jsconfig.json',
    'postcss.config.mjs',
    'next.config.mjs',
    'eslint.config.mjs'
];

const INCLUDED_EXTENSIONS = [
    '.js',
    '.mjs',
    '.ts',
    '.tsx',
    '.css',
    '.html',
    '.json'
];

function countLines(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split('\n').length;
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
        return 0;
    }
}

function walkDir(dir, stats = { totalLines: 0, fileCount: 0, breakdown: {} }) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileName = path.basename(filePath);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (EXCLUDED_DIRS.includes(fileName)) continue;
            walkDir(filePath, stats);
        } else {
            if (EXCLUDED_FILES.includes(fileName)) continue;
            
            const ext = path.extname(fileName).toLowerCase();
            if (INCLUDED_EXTENSIONS.includes(ext)) {
                const lines = countLines(filePath);
                stats.totalLines += lines;
                stats.fileCount += 1;
                stats.breakdown[ext] = (stats.breakdown[ext] || 0) + lines;
            }
        }
    }

    return stats;
}

const rootDir = path.resolve(__dirname, '..');
console.log(`Counting LOC in: ${rootDir}`);
console.log('Excluding:', EXCLUDED_DIRS.join(', '), 'and common lock/config files.\n');

const results = walkDir(rootDir);

console.log('--- Results ---');
console.log(`Total lines of code: ${results.totalLines}`);
console.log(`Total files counted: ${results.fileCount}`);
console.log('\nBreakdown by extension:');
Object.entries(results.breakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, lines]) => {
        console.log(`${ext}: ${lines} lines`);
    });
