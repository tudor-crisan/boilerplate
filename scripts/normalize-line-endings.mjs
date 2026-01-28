import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', 'node_modules', '.next', 'coverage', 'dist', 'out'];
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html', '.mjs', '.cjs'];

function normalizeLineEndings(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (IGNORE_DIRS.includes(entry.name)) continue;
            normalizeLineEndings(fullPath);
        } else if (entry.isFile()) {
            if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase()) || entry.name.startsWith('.')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (content.includes('\r\n')) {
                        console.log(`Normalizing: ${path.relative(ROOT_DIR, fullPath)}`);
                        const normalizedContent = content.replace(/\r\n/g, '\n');
                        fs.writeFileSync(fullPath, normalizedContent, 'utf8');
                    }
                } catch (err) {
                    console.error(`Failed to process ${fullPath}: ${err.message}`);
                }
            }
        }
    }
}

console.log('Starting line ending normalization (CRLF -> LF)...');
normalizeLineEndings(ROOT_DIR);
console.log('Normalization complete!');
