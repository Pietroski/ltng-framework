/**
* ltng-server.js
* A zero-dependency SSR/SSG server for ltng-framework.
*
* Usage:
*   node ltng-server.js           (Starts SSR server on port 3000)
*   node ltng-server.js --build   (Generates static files in ./dist)
*/

const http = require('http')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const mockDom = require('./mock-dom')


// Helper to render a file
function renderFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf8')

	// 1. Create a fresh DOM environment
	const window = mockDom.createWindow()
	const document = window.document

	// 2. Create VM Context
	// We use the window instance as the global object
	const sandbox = window
	sandbox.window = sandbox // Circular reference
	sandbox.global = sandbox // Node.js global reference

	// 3. Add Node.js globals that might be needed
	sandbox.console = console
	sandbox.setTimeout = setTimeout
	sandbox.clearTimeout = clearTimeout
	sandbox.setInterval = setInterval
	sandbox.clearInterval = clearInterval

	vm.createContext(sandbox)

	// 4. Parse HTML to find scripts
	// This is a very naive parser. It assumes scripts are <script src="..."> or inline <script>...</script>
	// It does NOT handle complex HTML parsing.

	// 4. Parse HTML to find scripts
	// Extract scripts
	const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi
	const srcRegex = /src=["'](.*?)["']/
    const typeRegex = /type=["'](.*?)["']/

    // 4.1 Parse Import Map
    let importMap = {}
    let mapMatch
    const mapRegex = /<script\b[^>]*type=["']importmap["'][^>]*>([\s\S]*?)<\/script>/gmi
    while ((mapMatch = mapRegex.exec(content)) !== null) {
        try {
            const map = JSON.parse(mapMatch[1])
            if (map.imports) {
                importMap = { ...importMap, ...map.imports }
            }
        } catch (e) {
            console.error('Failed to parse import map', e)
        }
    }

    // Helper to resolve path using import map or relative path
    function resolvePath(basePath, importPath) {
        if (importMap[importPath]) {
            // Resolve mapped path relative to the HTML file (or root?)
            // Usually import map paths are relative to the base URL (HTML file location)
            // But here we might have mapped it to '../../pkg/...'
            // We should resolve it relative to the HTML file.
            return path.join(path.dirname(filePath), importMap[importPath])
        }
        // Default relative resolve
        return path.join(basePath, importPath)
    }

    // Helper to transpile and run module
    const loadedModules = new Set()

    function loadModule(modulePath, context) {
        if (loadedModules.has(modulePath)) return
        loadedModules.add(modulePath)

        if (!fs.existsSync(modulePath)) {
            console.error(`Module not found: ${modulePath}`)
            return
        }
        
        let scriptContent = fs.readFileSync(modulePath, 'utf8')
        
        // Handle dependencies (imports and re-exports)
        // Matches:
        // 1. import ... from 'path'
        // 2. export ... from 'path'
        // 3. import 'path'
        const dependencyRegex = /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"](.*?)['"]|import\s+['"](.*?)['"]/g
        let match
        while ((match = dependencyRegex.exec(scriptContent)) !== null) {
            const depPathRaw = match[1] || match[2]
            const depPath = resolvePath(path.dirname(modulePath), depPathRaw)
            
            // Avoid infinite recursion if circular (naive check)
            // Ideally we should cache loaded modules.
            // For now, just load it.
            loadModule(depPath, context)
        }

        // Transpile
        // 1. export const/var/let X = ... -> const/var/let X = window.X = ...
        // 2. export function X ... -> function X ...; window.X = X;
        // 3. export class X ... -> class X ...; window.X = X;
        // 4. export default X -> window.default = X
        // 5. export { X } -> (nothing, X is already on window if imported)
        // 6. export * from '...' -> (handled by dependency loading)
        // 7. Remove import/export statements
        
        // 7. Remove import/export statements
        
        const transpiled = `(function() {
            ${scriptContent
            // Handle export const/var/let
            .replace(/export\s+(const|var|let)\s+(\w+)/g, '$1 $2 = window.$2')
            // Handle export function
            .replace(/export\s+function\s+(\w+)/g, 'window.$1 = function $1')
            // Handle export class
            .replace(/export\s+class\s+(\w+)/g, 'window.$1 = class $1')
            
            .replace(/export\s+default\s+(\w+)/g, 'window.default = $1')
            .replace(/export\s+\{([\s\S]*?)\}/g, '') // Remove named exports
            .replace(/(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"].*?['"]/g, '') // Remove imports/re-exports
            .replace(/import\s+['"].*?['"]/g, '') // Remove side-effect imports
            }
        })()`

        try {
            vm.runInContext(transpiled, context)
            // console.log(`Loaded module: ${modulePath}`)
        } catch (e) {
            console.error(`Error running module ${modulePath}:`, e)
        }
    }

	let match
	while ((match = scriptRegex.exec(content)) !== null) {
		const fullTag = match[0]
        const typeMatch = typeRegex.exec(fullTag)
        const type = typeMatch ? typeMatch[1] : ''
        const isModule = type === 'module'
        const isImportMap = type === 'importmap'

        if (isImportMap) continue // Already handled

		const innerScript = match[1]
		const srcMatch = srcRegex.exec(fullTag)

		if (srcMatch) {
			// External script
			const scriptPath = path.join(path.dirname(filePath), srcMatch[1])
			if (fs.existsSync(scriptPath)) {
                if (isModule) {
                    loadModule(scriptPath, sandbox)
                } else {
                    // Classic script
				    let scriptContent = fs.readFileSync(scriptPath, 'utf8')
				    try {
					    vm.runInContext(scriptContent, sandbox)
				    } catch (e) {
					    console.error(`Error running script ${srcMatch[1]}:`, e)
				    }
                }
			} else {
				console.error(`Script not found: ${scriptPath}`)
			}
		} else if (innerScript.trim()) {
			// Inline script
            if (isModule) {
                 // Inline module
                 // We need to handle imports
                 const dependencyRegex = /(?:import|export)\s+(?:({[\s\S]*?})|(\w+))\s+from\s+['"](.*?)['"]|import\s+['"](.*?)['"]/g
                 let depMatch
                 while ((depMatch = dependencyRegex.exec(innerScript)) !== null) {
                    const importsBlock = depMatch[1] // { ... }
                    const defaultImport = depMatch[2] // Name
                    const depPathRaw = depMatch[3] || depMatch[4]
                    
                    if (depPathRaw) {
                        const depPath = resolvePath(path.dirname(filePath), depPathRaw)
                        loadModule(depPath, sandbox)
                    }

                    // Handle Aliases
                    if (importsBlock) {
                        const content = importsBlock.replace(/[{}]/g, '')
                        const parts = content.split(',')
                        parts.forEach(part => {
                            const [original, alias] = part.split(/\s+as\s+/).map(s => s.trim())
                            if (alias && original) {
                                try {
                                    vm.runInContext(`window.${alias} = window.${original}`, sandbox)
                                } catch (e) {
                                    console.error(`Failed to set alias ${alias} for ${original}`, e)
                                }
                            }
                        })
                    }
                 }

                 // Remove imports
                 const scriptToRun = innerScript
                    .replace(/(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"].*?['"]/g, '')
                    .replace(/import\s+['"].*?['"]/g, '')

                 try {
                    vm.runInContext(scriptToRun, sandbox)
                 } catch (e) {
                    console.error('Error running inline module:', e)
                 }
            } else {
			    try {
				    vm.runInContext(innerScript, sandbox)
			    } catch (e) {
				    console.error('Error running inline script:', e)
			    }
            }
		}
	}

	// 5. Serialize
	// We inject the rendered body content back into the HTML
	// Naive injection: replace <body>...</body> or append to body if empty in source
	// Actually, our mock DOM only populated `document.body`.
	// We should replace the content inside <body> tag in the original HTML with our rendered HTML.

	// mockDom.document.body.toString() returns <body>...</body>
	// We want just the inner content usually, but since we are replacing the whole body...

	// Let's just replace the <body> tag in the source with the rendered body tag.
	const bodyRegex = /<body\b[^>]*>([\s\S]*?)<\/body>/i

	// We need to preserve the scripts that were in the body!
	// Extract them from the original body content
	const bodyMatch = bodyRegex.exec(content)
	let scripts = ''
	if (bodyMatch) {
		const innerBody = bodyMatch[1]
		const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi
		let match
		while ((match = scriptRegex.exec(innerBody)) !== null) {
			scripts += match[0] + '\n'
		}
	}

	const bodyContent = document.body.toString().replace('</body>', `${scripts}</body>`)
	let finalHtml = content.replace(bodyRegex, bodyContent)

	// Inject Head Content (Styles)
	const headRegex = /<head\b[^>]*>([\s\S]*?)<\/head>/i
	// We only want to append new links/styles to the existing head
	// document.head.toString() returns <head>...</head>
	// We want the inner content of our mock head
	const mockHeadContent = document.head.childNodes.map(c => c.toString()).join('')
	
	if (mockHeadContent) {
		if (headRegex.test(finalHtml)) {
			finalHtml = finalHtml.replace('</head>', `${mockHeadContent}</head>`)
		} else {
			// No head tag? prepend to body or html?
			// Ideally HTML should have head. If not, we might insert it before body.
			// For now, assume valid HTML structure or just ignore if no head.
		}
	}

	return finalHtml
}

// CLI Argument Parsing
const args = process.argv.slice(2)
const isBuild = args.includes('--build')
const modeArg = args.find(arg => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.split('=')[1] : 'csr' // Default to CSR
const portArg = args.find(arg => arg.startsWith('--port='))
const PORT = portArg ? parseInt(portArg.split('=')[1], 10) : 3000
const srcArg = args.find(arg => arg.startsWith('--src='))
const SRC_DIR = srcArg ? srcArg.split('=')[1] : '.'
const distArg = args.find(arg => arg.startsWith('--dist='))
const DIST_DIR = distArg ? distArg.split('=')[1] : './dist'

if (isBuild) {
	console.log(`Building static site from ${SRC_DIR} to ${DIST_DIR}...`)
	if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true })

	const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'))
	const referencedScripts = new Set()

	files.forEach(file => {
		console.log(`Rendering ${file}...`)
		try {
			const filePath = path.join(SRC_DIR, file)
			// We need to extract dependencies from the file content
			const content = fs.readFileSync(filePath, 'utf8')
			const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi
			const srcRegex = /src=["'](.*?)["']/

			let match
			while ((match = scriptRegex.exec(content)) !== null) {
				const srcMatch = srcRegex.exec(match[0])
				if (srcMatch) {
					referencedScripts.add(srcMatch[1])
				}
			}

			// Scan for CSS links
			const linkRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gmi
			const hrefRegex = /href=["'](.*?)["']/

			while ((match = linkRegex.exec(content)) !== null) {
				const hrefMatch = hrefRegex.exec(match[0])
				if (hrefMatch) {
					referencedScripts.add(hrefMatch[1])
				}
			}

			let html = renderFile(filePath)

            // Rewrite asset paths to be flat in dist
            referencedScripts.forEach(scriptPath => {
                const fileName = path.basename(scriptPath)
                // Simple string replacement for now. 
                // In a robust system we'd parse HTML, but here we just replace the src string.
                // We use split/join to replace all occurrences.
                html = html.split(scriptPath).join(fileName)
            })

			fs.writeFileSync(path.join(DIST_DIR, file), html)
			console.log(`Saved ${file}`)
		} catch (e) {
			console.error(`Failed to render ${file}:`, e)
		}
	})

	// Copy only referenced assets (JS, CSS)
	referencedScripts.forEach(file => {
		const filePath = path.join(SRC_DIR, file)
		if (fs.existsSync(filePath)) {
			// Flatten structure: copy all assets to root of dist
			const fileName = path.basename(file)
			const destPath = path.join(DIST_DIR, fileName)
            
            // Ensure we don't overwrite if multiple files have same name (naive check)
            if (fs.existsSync(destPath)) {
                console.log(`Asset ${fileName} already exists in dist, skipping copy.`)
            } else {
			    fs.copyFileSync(filePath, destPath)
			    console.log(`Copied referenced asset: ${file} -> ${fileName}`)
            }
		} else {
			console.warn(`Warning: Referenced asset ${file} not found at ${filePath}`)
		}
	})

	console.log('Build complete.')
	process.exit(0)
}

// Server Logic
const server = http.createServer((req, res) => {
	let url = req.url === '/' ? '/index.html' : req.url

	// Determine root directory based on mode
	let rootDir = path.resolve(SRC_DIR)
	if (mode === 'ssg') {
		rootDir = path.resolve(DIST_DIR)
	}

	let filePath = path.join(rootDir, url)
	let ext = path.extname(filePath)

	// Fallback: If file not found in rootDir, check project root (only for source mode)
	if (!fs.existsSync(filePath) && mode !== 'ssg') {
		const fallbackPath = path.join(__dirname, url)
		if (fs.existsSync(fallbackPath)) {
			filePath = fallbackPath
			ext = path.extname(filePath)
		}
	}

	if (fs.existsSync(filePath)) {
		if (ext === '.html') {
			if (mode === 'ssr') {
				// SSR Mode: Render on the fly
				try {
					const html = renderFile(filePath)
					res.writeHead(200, { 'Content-Type': 'text/html' })
					res.end(html)
				} catch (e) {
					res.writeHead(500)
					res.end('Error rendering page')
					console.error(e)
				}
			} else {
				// CSR or SSG Mode: Serve static HTML
				// For SSG, filePath is already pointing to dist/file.html (pre-rendered)
				// For CSR, filePath is pointing to ./file.html (raw)
				const content = fs.readFileSync(filePath)
				res.writeHead(200, { 'Content-Type': 'text/html' })
				res.end(content)
			}
		} else {
			// Serve static files (JS, CSS)
			const content = fs.readFileSync(filePath)
			const contentType = ext === '.js' ? 'text/javascript' :
				ext === '.css' ? 'text/css' : 'text/plain'
			res.writeHead(200, { 'Content-Type': contentType })
			res.end(content)
		}
	} else {
		res.writeHead(404)
		res.end('Not found')
	}
})

server.listen(PORT, () => {
	console.log(`Server running in ${mode.toUpperCase()} mode at http://localhost:${PORT}`)
	if (mode === 'ssg') {
		console.log(`Serving files from ${DIST_DIR}`)
	}
})
