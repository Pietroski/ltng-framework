const fs = require('fs')
const path = require('path')
const { transpile } = require('../internal/transpiler')

function handleCSR(req, res, config) {
    const { srcDir, rootDir } = config
    let url = req.url === '/' ? '/index.html' : req.url
    
    // Security check: prevent directory traversal
    // REMOVED for flexibility as per user request to serve relative paths outside root
    // if (url.includes('..')) {
    //     res.writeHead(403)
    //     res.end('Forbidden')
    //     return
    // }

    // Clean URL support: if URL has no extension, try adding .html
    // e.g., /search -> /search.html, /profile -> /profile.html
    const hasExtension = path.extname(url) !== ''
    if (!hasExtension && url !== '/') {
        const htmlPath = path.join(srcDir, url + '.html')
        if (fs.existsSync(htmlPath)) {
            url = url + '.html'
        }
    }

    let filePath = path.join(srcDir, url)
    
    // Fallback to rootDir if not found in srcDir (for shared assets like pkg/)
    // But wait, srcDir is usually where index.html is. 
    // If the user requests /pkg/components/div.js, it might be in rootDir/pkg/...
    // So we should check rootDir if srcDir fails, OR if the path is absolute-like.
    
    if (!fs.existsSync(filePath)) {
        // Try resolving from project root
        const potentialRootPath = path.join(rootDir, url)
        if (fs.existsSync(potentialRootPath)) {
            filePath = potentialRootPath
        } else {
            // New Fallback: Search Upwards
            // If the browser requested /ltng-framework/..., it means we might need to look in ../ltng-framework relative to root.
            // We'll search up to 3 levels up.
            let currentSearchDir = rootDir
            for (let i = 0; i < 3; i++) {
                currentSearchDir = path.join(currentSearchDir, '..')
                const potentialPath = path.join(currentSearchDir, url)
                if (fs.existsSync(potentialPath)) {
                    filePath = potentialPath
                    break
                }
            }
        }
    }

    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath)
        let content = fs.readFileSync(filePath)
        
        if (ext === '.js' || ext === '.mjs') {
            // Serve JS files as is.
            // We rely on native browser support for ES Modules and Import Maps.
            // Transpilation is only needed for Minification (bundling) and SSR/SSG (Node vm).
            res.writeHead(200, { 'Content-Type': 'text/javascript' })
        } else if (ext === '.html') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
        } else if (ext === '.css') {
            res.writeHead(200, { 'Content-Type': 'text/css' })
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' })
        }
        
        res.end(content)
    } else {
        res.writeHead(404)
        res.end('Not found')
    }
}

module.exports = handleCSR
