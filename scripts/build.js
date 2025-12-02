const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'ltng-framework.min.js');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
}

// Files to include in the bundle
// Order matters: Core first, then components
const CORE_FILE = path.join(ROOT_DIR, 'ltng-framework.js');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'pkg', 'components');

// Helper to minify code
function minify(code) {
    return code
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove full-line single-line comments (safe)
        .replace(/^\s*\/\/.*$/gm, '')
        // Remove leading/trailing whitespace from lines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) // Remove empty lines
        .join('\n'); // Keep newlines to avoid ASI issues!
}

// Helper to transform ES modules to global assignments
function transformModule(code, filename) {
    // This is a very naive transformation designed for this specific codebase
    // It assumes exports are like "export const Component = ..." or "export function Component..."
    
    let transformed = code;

    // Remove imports (we assume everything is bundled globally)
    // e.g., import { Button } from './button.js' -> removed
    transformed = transformed.replace(/import .*? from .*/g, '');
    
    // Transform exports
    // export const Button = ... -> window.Button = ...
    transformed = transformed.replace(/export const (\w+)/g, 'window.$1');
    
    // export function Button... -> window.Button = function Button...
    transformed = transformed.replace(/export function (\w+)/g, 'window.$1 = function $1');

    // Remove "export * from ..." lines (aggregators)
    transformed = transformed.replace(/export \* from .*/g, '');

    // Wrap in IIFE to prevent variable collisions (e.g. const GlobalDiv)
    return `(function() {
${transformed}
})();`;
}

async function build() {
    console.log('Building ltng-framework...');
    
    let bundleContent = '';

    // 1. Process Core
    console.log(`Processing core: ${path.basename(CORE_FILE)}`);
    const coreContent = fs.readFileSync(CORE_FILE, 'utf8');
    bundleContent += coreContent + '\n';

    // 2. Process Components
    if (fs.existsSync(COMPONENTS_DIR)) {
        const componentFiles = fs.readdirSync(COMPONENTS_DIR)
            .filter(file => file.endsWith('.js') && file !== 'index.js'); // Skip index.js aggregator

        for (const file of componentFiles) {
            console.log(`Processing component: ${file}`);
            const filePath = path.join(COMPONENTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const transformed = transformModule(content, file);
            bundleContent += transformed + '\n';
        }
    }

    // 3. Minify
    console.log('Minifying...');
    const minified = minify(bundleContent);

    // 4. Write Output
    fs.writeFileSync(OUTPUT_FILE, minified);
    console.log(`Build complete! Output: ${OUTPUT_FILE}`);
    console.log(`Original size: ${bundleContent.length} bytes`);
    console.log(`Minified size: ${minified.length} bytes`);
}

build().catch(console.error);
