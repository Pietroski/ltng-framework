const fs = require('fs')
const path = require('path')

/**
 * Resolves a path relative to a base directory or using an import map.
 * @param {string} basePath - The directory of the file initiating the import.
 * @param {string} importPath - The path to resolve.
 * @param {object} importMap - Optional import map.
 * @returns {string} The resolved absolute path.
 */
function resolvePath(basePath, importPath, importMap = {}) {
    if (importMap[importPath]) {
        // Import map paths are usually relative to the root or specific locations.
        // We assume they resolve to a path relative to the project root or absolute.
        // If it starts with /, it's absolute (from project root).
        // If relative, it's relative to what? usually the HTML file, but here we might need context.
        // For now, let's assume import map values are relative to the project root if they start with ./ or ../
        // Or if they are absolute paths.
        const mapped = importMap[importPath]
        if (path.isAbsolute(mapped)) {
            return mapped
        }
        // If mapped path is relative, it's relative to the project root?
        // Let's assume project root is 2 levels up from this script? 
        // No, we shouldn't make assumptions about where this script is running relative to project root 
        // without passing project root.
        // But for now, let's just resolve it relative to basePath if it looks relative.
        return path.resolve(basePath, mapped)
    }
    
    return path.resolve(basePath, importPath)
}

/**
 * Transpiles ES module code to a global-assignment format.
 * @param {string} code - The source code.
 * @param {string} filename - The filename for context (optional).
 * @returns {string} Transpiled code.
 */
function transpile(code, filename = '', options = {}) {
    let transpiled = code

    // 1. Handle Imports
    // ... (existing import logic) ...
    const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+['"](.*?)['"]/g
    transpiled = transpiled.replace(importRegex, (match, imports, source) => {
        // ... (existing assignment logic) ...
        const assignments = imports.split(',').map(part => {
            part = part.trim()
            if (!part) return ''
            
            if (part.includes(' as ')) {
                const [original, alias] = part.split(' as ').map(s => s.trim())
                return `var ${alias} = window.${original};`
            } else {
                return `var ${part} = window.${part};`
            }
        }).filter(Boolean).join('\n')
        
        return assignments
    })

    // Remove side-effect imports
    transpiled = transpiled.replace(/import\s+['"].*?['"]/g, '')
    
    // Remove other imports
    transpiled = transpiled.replace(/import\s+.*?from\s+['"].*?['"]/g, '')

    // 2. Handle Exports
    // ... (existing export logic) ...
    transpiled = transpiled.replace(/export\s+const\s+(\w+)/g, 'window.$1')
    transpiled = transpiled.replace(/export\s+var\s+(\w+)/g, 'window.$1')
    transpiled = transpiled.replace(/export\s+let\s+(\w+)/g, 'window.$1')
    
    transpiled = transpiled.replace(/export\s+function\s+(\w+)/g, 'window.$1 = function $1')
    
    transpiled = transpiled.replace(/export\s+class\s+(\w+)/g, 'window.$1 = class $1')
    
    if (/export\s+default\s+\{/.test(transpiled)) {
        transpiled = transpiled.replace(/export\s+default\s+\{/, 'var __ltng_default_export = {')
        transpiled += '\nObject.assign(window, __ltng_default_export);'
    }

    transpiled = transpiled.replace(/export\s+default\s+(\w+)/g, 'window.default = $1')
    
    transpiled = transpiled.replace(/export\s+\{([\s\S]*?)\}/g, (match, exports) => {
        // ... (existing export logic) ...
        return exports.split(',').map(part => {
            part = part.trim()
            if (!part) return ''
            if (part.includes(' as ')) {
                const [original, alias] = part.split(' as ').map(s => s.trim())
                return `window.${alias} = ${original};`
            } else {
                return `window.${part} = ${part};`
            }
        }).join('\n')
    })

    transpiled = transpiled.replace(/export\s+\*\s+from\s+['"].*?['"]/g, '')

    // Optional: Strip loadCSS calls (for minified bundles where assets are manually handled)
    if (options.stripLoadCSS) {
        // Matches: window.loadCSS(new URL(..., import.meta.url).href)
        transpiled = transpiled.replace(/window\.loadCSS\(new URL\(.*?, import\.meta\.url\)\.href\)/g, '')
    }

    // Handle import.meta
    transpiled = transpiled.replace(/import\.meta/g, `({ url: window.location.origin + '/mock/${filename}' })`)

    return transpiled
}

/**
 * Minifies code by removing comments and whitespace.
 * @param {string} code 
 * @returns {string}
 */
function minify(code) {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
        .replace(/^\s*\/\/.*$/gm, '')     // Line comments
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
}

module.exports = {
    resolvePath,
    transpile,
    minify
}
