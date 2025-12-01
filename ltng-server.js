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

	// Extract scripts
	const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi
	const srcRegex = /src=["'](.*?)["']/

	let match
	while ((match = scriptRegex.exec(content)) !== null) {
		const fullTag = match[0]
        const isModule = fullTag.includes('type="module"')

		const innerScript = match[1]
		const srcMatch = srcRegex.exec(fullTag)

		if (srcMatch) {
			// External script
			const scriptPath = path.join(path.dirname(filePath), srcMatch[1])
			if (fs.existsSync(scriptPath)) {
				let scriptContent = fs.readFileSync(scriptPath, 'utf8')
                
                if (isModule) {
                    // Basic ESM transpilation for SSR
                    // 1. Remove imports (we assume we load them recursively or they are already loaded? No, we need to load them)
                    // Actually, handling recursive imports is hard.
                    // For now, let's assume flat structure or just strip imports and exports and hope globals match.
                    // But imports are needed for execution order.
                    
                    // Regex to find imports: import { X } from './path.js'
                    const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"](.*?)['"]/g
                    let importMatch
                    while ((importMatch = importRegex.exec(scriptContent)) !== null) {
                        const importPath = path.join(path.dirname(scriptPath), importMatch[1])
                        if (fs.existsSync(importPath)) {
                             console.log(`Loading imported module: ${importMatch[1]}`)
                             // Recursively load imported file
                             const importedContent = fs.readFileSync(importPath, 'utf8')
                             // Transpile and run imported content first
                             // Fix: Assign to both var (global) and window property
                             // Regex matches "export const Name", replacement "var Name = window.Name"
                             // The original "=" follows the match, so we get "var Name = window.Name = ..."
                             const transpiledImport = importedContent
                                .replace(/export\s+const\s+(\w+)/g, 'var $1 = window.$1')
                                .replace(/export\s+default\s+(\w+)/g, 'window.default = $1')
                                .replace(/import\s+.*?from\s+['"].*?['"]/g, '') // Remove imports from imported file
                             
                             try {
                                vm.runInContext(transpiledImport, sandbox)
                                console.log(`Successfully loaded ${importMatch[1]}`)
                             } catch(e) {
                                 console.error(`Error running imported script ${importMatch[1]}:`, e)
                             }
                        } else {
                            console.error(`Import not found: ${importPath}`)
                        }
                    }

                    // Transpile current script
                    scriptContent = scriptContent
                        .replace(/export\s+const\s+(\w+)/g, 'var $1 = window.$1')
                        .replace(/export\s+default\s+(\w+)/g, 'window.default = $1')
                        .replace(/import\s+.*?from\s+['"].*?['"]/g, '') // Remove imports
                    
                    console.log('Running transpiled module script...')
                }

				try {
					vm.runInContext(scriptContent, sandbox)
				} catch (e) {
					console.error(`Error running script ${srcMatch[1]}:`, e)
				}
			} else {
				console.error(`Script not found: ${scriptPath} (referenced from ${filePath})`)
			}
		} else if (innerScript.trim()) {
			// Inline script
            let scriptToRun = innerScript
            if (isModule) {
                 console.log('Processing inline module script...')
                 // Handle imports in inline module
                 const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"](.*?)['"]/g
                 let importMatch
                 while ((importMatch = importRegex.exec(innerScript)) !== null) {
                        const importPath = path.join(path.dirname(filePath), importMatch[1])
                        if (fs.existsSync(importPath)) {
                             console.log(`Loading inline import: ${importMatch[1]}`)
                             const importedContent = fs.readFileSync(importPath, 'utf8')
                             const transpiledImport = importedContent
                                .replace(/export\s+const\s+(\w+)/g, 'var $1 = window.$1')
                                .replace(/export\s+default\s+(\w+)/g, 'window.default = $1')
                                .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
                             
                             try {
                                vm.runInContext(transpiledImport, sandbox)
                                console.log(`Successfully loaded inline import ${importMatch[1]}`)
                             } catch(e) {
                                 console.error(`Error running imported script ${importMatch[1]}:`, e)
                             }
                        } else {
                            console.error(`Inline import not found: ${importPath}`)
                        }
                 }
                 scriptToRun = scriptToRun.replace(/import\s+.*?from\s+['"].*?['"]/g, '')
            }

			try {
				vm.runInContext(scriptToRun, sandbox)
			} catch (e) {
				console.error('Error running inline script:', e)
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
