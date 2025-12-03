const fs = require('fs')
const path = require('path')
const { transpile, minify } = require('./internal/transpiler')

const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'build')

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
}

// Paths
const CORE_FILE = path.join(ROOT_DIR, 'ltng-framework.js')
const TESTING_TOOLS_DIR = path.join(ROOT_DIR, 'ltng-testingtools')
const TOOLS_DIR = path.join(ROOT_DIR, 'ltng-tools')
const COMPONENTS_DIR = path.join(ROOT_DIR, 'ltng-components')
const BOOK_DIR = path.join(ROOT_DIR, 'ltng-book')

// Helper to get all JS files recursively
function getJsFilesRecursively(dir) {
    let results = []
    if (!fs.existsSync(dir)) return results
    
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(getJsFilesRecursively(filePath))
        } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
            // Exclude test files
            if (!file.includes('.test.')) {
                results.push(filePath)
            }
        }
    })
    return results
}

// Helper to sort files (naive dependency sort)
function sortFiles(files) {
    return files.sort((a, b) => {
        const baseA = path.basename(a)
        const baseB = path.basename(b)
        
        // Core framework always first (handled by bundle definition usually, but good to be safe)
        if (baseA === 'ltng-framework.js') return -1
        if (baseB === 'ltng-framework.js') return 1

        // Registry/Core utilities first
        if (baseA === 'registry.js') return -1
        if (baseB === 'registry.js') return 1
        
        return a.localeCompare(b)
    })
}

async function build() {
    console.log('Starting minification process...')

    const coreFiles = [CORE_FILE]
    const testingFiles = getJsFilesRecursively(TESTING_TOOLS_DIR)
    const toolsFiles = getJsFilesRecursively(TOOLS_DIR)
    const componentFiles = getJsFilesRecursively(COMPONENTS_DIR)
    const bookFiles = getJsFilesRecursively(BOOK_DIR)

    // Define Bundles
    const bundles = [
        // Individual
        { name: 'ltng-framework', files: coreFiles },
        { name: 'ltng-testingtools', files: testingFiles },
        { name: 'ltng-book', files: bookFiles },
        { name: 'ltng-tools', files: toolsFiles },
        { name: 'ltng-components', files: componentFiles },
        
        // Framework + X
        { name: 'ltng-framework-testingtools', files: [...coreFiles, ...testingFiles] },
        { name: 'ltng-framework-book', files: [...coreFiles, ...bookFiles] },
        { name: 'ltng-framework-tools', files: [...coreFiles, ...toolsFiles] },
        { name: 'ltng-framework-components', files: [...coreFiles, ...componentFiles] },
        
        // Framework + Testing + X
        { name: 'ltng-framework-testingtools-book', files: [...coreFiles, ...testingFiles, ...bookFiles] },
        { name: 'ltng-framework-testingtools-tools', files: [...coreFiles, ...testingFiles, ...toolsFiles] },
        
        // Everything
        { name: 'ltng-framework-all', files: [...coreFiles, ...testingFiles, ...bookFiles, ...toolsFiles, ...componentFiles] }
    ]

    for (const bundle of bundles) {
        console.log(`Building ${bundle.name}...`)
        
        // Remove duplicates
        const uniqueFiles = [...new Set(bundle.files)]
        const sortedFiles = sortFiles(uniqueFiles)
        
        let bundleContent = ''
        
        for (const file of sortedFiles) {
            const content = fs.readFileSync(file, 'utf8')
            // Transpile
            // We wrap in IIFE to avoid global scope pollution, 
            // BUT the transpiler assigns exports to window, so they become global anyway.
            // The IIFE protects local variables.
            
            // Special case: ltng-framework.js is already global-friendly (no exports), 
            // but wrapping it is fine too if it assigns to window.
            // However, ltng-framework.js has `window.X = ...` directly.
            
            const transpiled = transpile(content, path.basename(file), { stripLoadCSS: true })
            bundleContent += `// File: ${path.basename(file)}\n(function(){\n${transpiled}\n})();\n`
        }
        
        const minified = minify(bundleContent)
        const outputPath = path.join(DIST_DIR, `${bundle.name}.min.js`)
        
        fs.writeFileSync(outputPath, minified)
        console.log(`Created ${bundle.name}.min.js (${minified.length} bytes)`)
    }
    
    console.log('Minification complete.')
}

build().catch(console.error)
