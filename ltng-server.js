/**
 * ltng-server.js
 * A zero-dependency SSR/SSG server for ltng-framework.
 * 
 * Usage:
 *   node ltng-server.js           (Starts SSR server on port 3000)
 *   node ltng-server.js --build   (Generates static files in ./dist)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mockDom = require('./mock-dom');


// Helper to render a file
function renderFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Create a fresh DOM environment
    const window = mockDom.createWindow();
    const document = window.document;

    // 2. Create VM Context
    // We use the window instance as the global object
    const sandbox = window;
    sandbox.window = sandbox; // Circular reference
    sandbox.global = sandbox; // Node.js global reference

    // Add Node.js globals that might be needed
    sandbox.console = console;
    sandbox.setTimeout = setTimeout;
    sandbox.clearTimeout = clearTimeout;
    sandbox.setInterval = setInterval;
    sandbox.clearInterval = clearInterval;

    vm.createContext(sandbox);

    // 3. Parse HTML to find scripts
    // This is a very naive parser. It assumes scripts are <script src="..."> or inline <script>...</script>
    // It does NOT handle complex HTML parsing.

    // Extract scripts
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
    const srcRegex = /src=["'](.*?)["']/;

    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const innerScript = match[1];
        const srcMatch = srcRegex.exec(fullTag);

        if (srcMatch) {
            // External script
            const scriptPath = path.join(path.dirname(filePath), srcMatch[1]);
            if (fs.existsSync(scriptPath)) {
                const scriptContent = fs.readFileSync(scriptPath, 'utf8');
                try {
                    vm.runInContext(scriptContent, sandbox);
                } catch (e) {
                    console.error(`Error running script ${srcMatch[1]}:`, e);
                }
            }
        } else if (innerScript.trim()) {
            // Inline script
            try {
                vm.runInContext(innerScript, sandbox);
            } catch (e) {
                console.error('Error running inline script:', e);
            }
        }
    }

    // 4. Serialize
    // We inject the rendered body content back into the HTML
    // Naive injection: replace <body>...</body> or append to body if empty in source
    // Actually, our mock DOM only populated `document.body`.
    // We should replace the content inside <body> tag in the original HTML with our rendered HTML.

    // mockDom.document.body.toString() returns <body>...</body>
    // We want just the inner content usually, but since we are replacing the whole body...

    // Let's just replace the <body> tag in the source with the rendered body tag.
    const bodyRegex = /<body\b[^>]*>([\s\S]*?)<\/body>/i;

    // We need to preserve the scripts that were in the body!
    // Extract them from the original body content
    const bodyMatch = bodyRegex.exec(content);
    let scripts = '';
    if (bodyMatch) {
        const innerBody = bodyMatch[1];
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
        let match;
        while ((match = scriptRegex.exec(innerBody)) !== null) {
            scripts += match[0] + '\n';
        }
    }

    const bodyContent = document.body.toString().replace('</body>', `${scripts}</body>`);
    const finalHtml = content.replace(bodyRegex, bodyContent);

    return finalHtml;
}

// CLI Argument Parsing
const args = process.argv.slice(2);
const isBuild = args.includes('--build');
const modeArg = args.find(arg => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'ssr'; // Default to SSR
const portArg = args.find(arg => arg.startsWith('--port='));
const PORT = portArg ? parseInt(portArg.split('=')[1], 10) : 3000;
const srcArg = args.find(arg => arg.startsWith('--src='));
const SRC_DIR = srcArg ? srcArg.split('=')[1] : '.';
const distArg = args.find(arg => arg.startsWith('--dist='));
const DIST_DIR = distArg ? distArg.split('=')[1] : './dist';

if (isBuild) {
    console.log(`Building static site from ${SRC_DIR} to ${DIST_DIR}...`);
    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));
    const referencedScripts = new Set();

    files.forEach(file => {
        console.log(`Rendering ${file}...`);
        try {
            const filePath = path.join(SRC_DIR, file);
            // We need to extract dependencies from the file content
            const content = fs.readFileSync(filePath, 'utf8');
            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
            const srcRegex = /src=["'](.*?)["']/;

            let match;
            while ((match = scriptRegex.exec(content)) !== null) {
                const srcMatch = srcRegex.exec(match[0]);
                if (srcMatch) {
                    referencedScripts.add(srcMatch[1]);
                }
            }

            // Scan for CSS links
            const linkRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gmi;
            const hrefRegex = /href=["'](.*?)["']/;

            while ((match = linkRegex.exec(content)) !== null) {
                const hrefMatch = hrefRegex.exec(match[0]);
                if (hrefMatch) {
                    referencedScripts.add(hrefMatch[1]);
                }
            }

            const html = renderFile(filePath);
            fs.writeFileSync(path.join(DIST_DIR, file), html);
            console.log(`Saved ${file}`);
        } catch (e) {
            console.error(`Failed to render ${file}:`, e);
        }
    });

    // Copy only referenced assets (JS, CSS)
    referencedScripts.forEach(file => {
        const filePath = path.join(SRC_DIR, file);
        if (fs.existsSync(filePath)) {
            // Create subdirectories if needed (e.g. css/style.css)
            const destPath = path.join(DIST_DIR, file);
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            fs.copyFileSync(filePath, destPath);
            console.log(`Copied referenced asset: ${file}`);
        } else {
            console.warn(`Warning: Referenced asset ${file} not found.`);
        }
    });

    console.log('Build complete.');
    process.exit(0);
}

// Server Logic
const server = http.createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;

    // Determine root directory based on mode
    let rootDir = path.resolve(SRC_DIR);
    if (mode === 'ssg') {
        rootDir = path.resolve(DIST_DIR);
    }

    let filePath = path.join(rootDir, url);
    let ext = path.extname(filePath);

    // Fallback: If file not found in rootDir, check project root (only for source mode)
    if (!fs.existsSync(filePath) && mode !== 'ssg') {
        const fallbackPath = path.join(__dirname, url);
        if (fs.existsSync(fallbackPath)) {
            filePath = fallbackPath;
            ext = path.extname(filePath);
        }
    }

    if (fs.existsSync(filePath)) {
        if (ext === '.html') {
            if (mode === 'ssr') {
                // SSR Mode: Render on the fly
                try {
                    const html = renderFile(filePath);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                } catch (e) {
                    res.writeHead(500);
                    res.end('Error rendering page');
                    console.error(e);
                }
            } else {
                // CSR or SSG Mode: Serve static HTML
                // For SSG, filePath is already pointing to dist/file.html (pre-rendered)
                // For CSR, filePath is pointing to ./file.html (raw)
                const content = fs.readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        } else {
            // Serve static files (JS, CSS)
            const content = fs.readFileSync(filePath);
            const contentType = ext === '.js' ? 'text/javascript' :
                ext === '.css' ? 'text/css' : 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running in ${mode.toUpperCase()} mode at http://localhost:${PORT}`);
    if (mode === 'ssg') {
        console.log(`Serving files from ${DIST_DIR}`);
    }
});
