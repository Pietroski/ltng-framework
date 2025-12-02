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

    // Handle CommonJS module.exports
    if (transformed.includes('module.exports')) {
         return `(function() {
            const module = { exports: {} };
            const exports = module.exports;
            ${transformed}
            Object.assign(window, module.exports);
         })();`;
    }

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
                // For simple imports like "import { Button }", we can either:
                // 1. Do nothing (rely on global window.Button)
                // 2. Create a local const (const Button = window.Button)
                // Creating a local const is safer and supports the case where the global might be shadowed?
                // But mostly it ensures that if the code uses 'Button', it gets it.
                return `const ${part} = window.${part};`;
            }
        }).filter(Boolean).join('\n');
        
        return assignments;
    });

    // Remove any remaining side-effect imports (e.g. import './style.css')
    transformed = transformed.replace(/import\s+['"].*?['"]/g, '');
    
    // Transform exports
    // export const Button = ... -> window.Button = ...
    transformed = transformed.replace(/export const (\w+)/g, 'window.$1');
    
    // export function Button... -> window.Button = function Button...
    transformed = transformed.replace(/export function (\w+)/g, 'window.$1 = function $1');

    // Remove "export * from ..." lines (aggregators)
    transformed = transformed.replace(/export \* from .*/g, '');

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
            results = results.concat(getJsFilesRecursively(filePath));
        } else if (file.endsWith('.js') && file !== 'index.js') {
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
        
        // Priority 2: Stories (must be before app.js)
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
        {
            name: 'ltng-framework-with-testing-book.min.js',
            files: [...coreFiles, ...testingFiles, ...componentFiles, ...bookFiles]
        },
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
