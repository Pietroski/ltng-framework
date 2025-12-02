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

    // Populate mock DOM body with original content so scripts can find elements (like #root)
    const bodyRegex = /<body\b[^>]*>([\s\S]*?)<\/body>/i
    const bodyMatch = bodyRegex.exec(content)
    if (bodyMatch) {
        // We need to strip scripts from the body content before setting it to innerHTML
        // otherwise they might be executed twice or cause issues?
        // actually, mockDom doesn't support innerHTML parsing.
        // So we manually create the root element if we find it.
        const bodyInner = bodyMatch[1];
        if (bodyInner.includes('id="root"') || bodyInner.includes("id='root'")) {
            const root = document.createElement('div');
            root.setAttribute('id', 'root');
            document.body.appendChild(root);
        }
    }

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
        
        // Handle CommonJS module.exports
        let isCommonJS = scriptContent.includes('module.exports') || scriptContent.includes('exports.')

        let transpiled;
        if (isCommonJS) {
             transpiled = transpileCommonJS(scriptContent)
        } else {
            transpiled = `(function() {
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
        }

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
    // We need to preserve the scripts that were in the body!
    // They were stripped when we populated mockDom, but we want them in the final output.
    // We can re-extract them from the original content.
    
	let scripts = ''
	if (bodyMatch) {
		const innerBody = bodyMatch[1]
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

			// 6. Scan rendered HTML for assets to copy
			// We look for <script src="...">, <link href="..."> and importmaps
			const assetsToCopy = new Set()

			// Scripts and Links in Rendered HTML
			const assetRegex = /<(?:script|link)\b[^>]*?(?:src|href)=["'](.*?)["'][^>]*>/gmi
			while ((match = assetRegex.exec(html)) !== null) {
				assetsToCopy.add(match[1])
			}

			// Import Maps
			const mapRegex = /<script\b[^>]*type=["']importmap["'][^>]*>([\s\S]*?)<\/script>/gmi
			while ((match = mapRegex.exec(content)) !== null) {
				try {
					const map = JSON.parse(match[1])
					if (map.imports) {
						Object.values(map.imports).forEach(path => assetsToCopy.add(path))
					}
				} catch (e) {
					console.error('Failed to parse import map during build', e)
				}
			}

			// Copy Assets
			for (const assetPath of assetsToCopy) {
				try {
					let srcPath
					let destPath

					if (assetPath.startsWith('/')) {
						// Absolute path from project root (e.g. /pkg/...)
						srcPath = path.join(process.cwd(), assetPath)
						destPath = path.join(DIST_DIR, assetPath)
					} else {
						// Relative path
						srcPath = path.resolve(SRC_DIR, assetPath)
						
						// Determine destination based on whether it's inside SRC_DIR or not
						if (srcPath.startsWith(path.resolve(SRC_DIR))) {
							// Inside SRC_DIR: keep relative structure from SRC_DIR
							const relToSrc = path.relative(SRC_DIR, srcPath)
							destPath = path.join(DIST_DIR, relToSrc)
						} else {
							// Outside SRC_DIR (e.g. ../../pkg/...): mirror project structure inside DIST_DIR
							// This assumes the browser resolves ../../ to root /
							const relToProject = path.relative(process.cwd(), srcPath)
							destPath = path.join(DIST_DIR, relToProject)
						}
					}

					if (fs.existsSync(srcPath)) {
						const destDir = path.dirname(destPath)
						if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
						
						// Only copy if source and dest are different
						if (srcPath !== destPath) {
							// Check if file already exists to avoid infinite loops or redundant copies
							// But we need to allow overwriting if needed, or just skip.
							// For scanning dependencies, we must process even if copied? 
							// No, if we already processed this assetPath, we shouldn't do it again.
							// But assetsToCopy is a Set, so we iterate unique items.
							
							if (!fs.existsSync(destPath)) {
                                fs.copyFileSync(srcPath, destPath)
							    console.log(`Copied asset: ${assetPath}`)
                            }
						}

                        // Recursively scan JS files for dependencies
                        if (srcPath.endsWith('.js') || srcPath.endsWith('.mjs')) {
                            const jsContent = fs.readFileSync(srcPath, 'utf8')
                            
                            // Scan for imports
                            const importRegex = /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"](.*?)['"]|import\s+['"](.*?)['"]/g
                            let match
                            while ((match = importRegex.exec(jsContent)) !== null) {
                                const importPath = match[1] || match[2]
                                if (importPath && !importPath.startsWith('http')) {
                                    const assetDir = path.dirname(assetPath)
                                    const resolvedImport = path.join(assetDir, importPath)
                                    assetsToCopy.add(resolvedImport)
                                }
                            }

                            // Scan for loadCSS calls
                            // Matches: window.loadCSS('path') or loadCSS('path')
                            const loadCssRegex = /loadCSS\(['"](.*?)['"]\)/g
                            while ((match = loadCssRegex.exec(jsContent)) !== null) {
                                const cssPath = match[1]
                                if (cssPath && !cssPath.startsWith('http')) {
                                    // CSS paths in loadCSS are usually absolute from root (e.g. /pkg/...)
                                    // or relative.
                                    // If it starts with /, treat as absolute from project root.
                                    // If relative, treat relative to the JS file? 
                                    // Usually loadCSS('/pkg/...') is used.
                                    assetsToCopy.add(cssPath)
                                }
                            }
                        }

					} else {
						// console.warn(`Asset not found: ${srcPath}`)
					}
				} catch (e) {
					console.error(`Error copying asset ${assetPath}:`, e)
				}
			}

			fs.writeFileSync(path.join(DIST_DIR, file), html)
			console.log(`Saved ${file}`)
		} catch (e) {
			console.error(`Failed to render ${file}:`, e)
		}
	})

	console.log('Build complete.')
	process.exit(0)
}

// Helper to transpile CommonJS to ESM-compatible IIFE
function transpileCommonJS(scriptContent) {
    return `(function() {
        const module = { exports: {} };
        const exports = module.exports;
        ${scriptContent}
        // Safe assignment to window
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
    })()`
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
			let content = fs.readFileSync(filePath)
            
            // On-the-fly transpilation for JS files in CSR mode
            if (ext === '.js' && mode === 'csr') {
                const textContent = content.toString('utf8')
                if (textContent.includes('module.exports') || textContent.includes('exports.')) {
                    content = transpileCommonJS(textContent)
                }
            }

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
