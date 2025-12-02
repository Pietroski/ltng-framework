const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'build');

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

// Paths
const CORE_FILE = path.join(ROOT_DIR, 'ltng-framework.js');
const TESTING_TOOLS_DIR = path.join(ROOT_DIR, 'testingtools');
const PKG_DIR = path.join(ROOT_DIR, 'pkg');
const COMPONENTS_DIR = path.join(PKG_DIR, 'components');

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
    let transformed = code;
    // Handle spread require(...)
    // e.g. ...require('./foo') -> ...{} (or remove it)
    // Since we assume exports are already on window, we don't need to re-export them if they are just aggregators.
    // But if we remove it, we might break object structure if it expects properties.
    // However, if the child module put its exports on window, they are global.
    // The parent module trying to re-export them as its own properties is redundant for the "everything is global" strategy.
    // So we can replace `...require(...)` with nothing (empty string) if it's in an object literal?
    // Or better, replace `require(...)` with `{}` when it's being spread?
    // No, `...{}` is valid.
    transformed = transformed.replace(/\.\.\.require\s*\(\s*['"].*?['"]\s*\)/g, '');

    // Handle CommonJS require(...)
    // We assume that required modules have already been loaded and their exports are on window.
    // So const { foo } = require('./bar') becomes const { foo } = window;
    // And const bar = require('./bar') becomes const bar = window;
    // This is a naive assumption that everything is flattened on window.
    // We use a slightly more permissive regex to catch variations.
    transformed = transformed.replace(/require\s*\(\s*['"].*?['"]\s*\)/g, 'window');

    // Handle imports with aliases and assignments
    // Regex to find: import { ... } from '...'
    const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+['"](.*?)['"]/g;
    
    transformed = transformed.replace(importRegex, (match, imports, source) => {
        // imports is the content inside { }
        // e.g. "Div as LTNGDiv, Button as LTNGButton"
        
        const assignments = imports.split(',').map(part => {
            part = part.trim();
            if (!part) return '';
            
            if (part.includes(' as ')) {
                const [original, alias] = part.split(' as ').map(s => s.trim());
                return `const ${alias} = window.${original};`;
            } else {
                return `const ${part} = window.${part};`;
            }
        }).filter(Boolean).join('\n');
        
        return assignments;
    });

    // Remove any remaining side-effect imports (e.g. import './style.css')
    transformed = transformed.replace(/import\s+['"].*?['"]/g, '');

    // Handle CommonJS module.exports
    if (transformed.includes('module.exports')) {
         return `(function() {
            const module = { exports: {} };
            const exports = module.exports;
            ${transformed}
            // Safe assignment to window to avoid errors with read-only properties (window, document, etc.)
            const safeAssign = (target, source) => {
                for (const key in source) {
                    try {
                        target[key] = source[key];
                    } catch (e) {
                        // Ignore errors for read-only properties
                    }
                }
            };
            safeAssign(window, module.exports);
         })();`;
    }
    
    // Transform exports
    // export const Button = ... -> window.Button = ...
    transformed = transformed.replace(/export\s+const\s+(\w+)/g, 'window.$1');
    
    // export function Button... -> window.Button = function Button...
    transformed = transformed.replace(/export\s+function\s+(\w+)/g, 'window.$1 = function $1');

    // export class Button... -> window.Button = class Button...
    transformed = transformed.replace(/export\s+class\s+(\w+)/g, 'window.$1 = class $1');

    // export default ... -> window.default = ... (or ignore if not needed globally)
    // For now, let's map it to window.defaultExport_<filename> to avoid collisions?
    // Or just window.default if we assume single entry? No, this is a bundle.
    // Let's just strip export default for now as it might be causing the syntax error if not handled.
    // Or better: window.default = ...
    transformed = transformed.replace(/export\s+default\s+/g, 'window.default = ');

    // Remove "export * from ..." lines (aggregators)
    transformed = transformed.replace(/export\s+\*\s+from.*/g, '');

    // Remove named exports like "export { foo, bar }"
    transformed = transformed.replace(/export\s+\{([\s\S]*?)\}/g, '');

    // Wrap in IIFE
    return `(function() {
${transformed}
})();`;
}

// Helper to get all JS files recursively
function getJsFilesRecursively(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            // Skip ltng-book for now as requested
            if (file === 'ltng-book') return;
            results = results.concat(getJsFilesRecursively(filePath));
        } else if (file.endsWith('.js') && !file.endsWith('.test.js')) {
            results.push(filePath);
        }
    });
    return results;
}

// Helper to process a list of files
function processFiles(files) {
    let content = '';
    for (const file of files) {
        console.log(`Processing: ${path.relative(ROOT_DIR, file)}`);
        const fileContent = fs.readFileSync(file, 'utf8');
        // If it's the core file, we might not want to wrap it in IIFE if it wasn't before?
        // The original script didn't wrap CORE_FILE.
        // But it did wrap components.
        // Let's check if it's the core file.
        if (file === CORE_FILE) {
             content += fileContent + '\n';
        } else {
             content += transformModule(fileContent, path.basename(file)) + '\n';
        }
    }
    return content;
}

// Helper to sort files for dependency management
function sortFiles(files) {
    return files.sort((a, b) => {
        const baseA = path.basename(a);
        const baseB = path.basename(b);
        
        // Priority 1: registry.js (must be first)
        if (baseA === 'registry.js') return -1;
        if (baseB === 'registry.js') return 1;

        // Priority 2: Testing Tools (must be before pkg tests)
        const isTestingA = a.includes('/testingtools/');
        const isTestingB = b.includes('/testingtools/');
        if (isTestingA && !isTestingB) return -1;
        if (!isTestingA && isTestingB) return 1;

        // Priority 3: Tools (must be before other pkg modules that use them)
        const isToolsA = a.includes('/pkg/tools/');
        const isToolsB = b.includes('/pkg/tools/');
        if (isToolsA && !isToolsB) return -1;
        if (!isToolsA && isToolsB) return 1;
        
        // Priority 3: Stories (must be before app.js)
        const isStoryA = baseA.endsWith('.story.js');
        const isStoryB = baseB.endsWith('.story.js');
        if (isStoryA && !isStoryB) return -1; // Stories come earlier
        if (!isStoryA && isStoryB) return 1;
        
        // Priority 3: app.js (must be last)
        if (baseA === 'app.js') return 1;
        if (baseB === 'app.js') return -1;
        
        // Default: Alphabetical
        return a.localeCompare(b);
    });
}

async function build() {
    console.log('Starting build process...');

    // Define file sets
    const coreFiles = [CORE_FILE];
    const testingFiles = getJsFilesRecursively(TESTING_TOOLS_DIR);
    const componentFiles = getJsFilesRecursively(COMPONENTS_DIR);
    const bookFiles = getJsFilesRecursively(path.join(PKG_DIR, 'ltng-book'));
    const allPkgFiles = getJsFilesRecursively(PKG_DIR);

    // Define targets
    const targets = [
        {
            name: 'ltng-framework.min.js',
            files: coreFiles
        },
        {
            name: 'ltng-framework-with-testing.min.js',
            files: [...coreFiles, ...testingFiles]
        },
        {
            name: 'ltng-framework-with-testing-components.min.js',
            files: [...coreFiles, ...testingFiles, ...componentFiles]
        },
        // {
        //     name: 'ltng-framework-with-testing-book.min.js',
        //     files: [...coreFiles, ...testingFiles, ...componentFiles, ...bookFiles]
        // },
        {
            name: 'ltng-framework-full.min.js',
            files: [...coreFiles, ...testingFiles, ...allPkgFiles]
        }
    ];

    for (const target of targets) {
        console.log(`\nBuilding target: ${target.name}`);
        
        // Remove duplicates just in case (e.g. if components are in allPkgFiles)
        let uniqueFiles = [...new Set(target.files)];
        
        // Sort files
        uniqueFiles = sortFiles(uniqueFiles);
        
        const bundleContent = processFiles(uniqueFiles);
        const minified = minify(bundleContent);
        
        const outputPath = path.join(BUILD_DIR, target.name);
        fs.writeFileSync(outputPath, minified);
        
        console.log(`Created ${target.name}`);
        console.log(`Size: ${minified.length} bytes`);
    }
    
    console.log('\nBuild complete!');
}

build().catch(console.error);
