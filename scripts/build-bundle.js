const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'build');
const COMPONENTS_DIR = path.join(ROOT, 'ltng-components');

// Ensure build dir exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
}

const { bundleCss } = require('./internal/css-bundler');



// 1. Bundle CSS
bundleCss(ROOT, COMPONENTS_DIR, BUILD_DIR);

// 2. Build JS
console.log('Building JS...');
try {
    // Standard esbuild command. We use platform=browser since this is for the browser bundle, 
    // but keep platform=node if that was the working config (user's Makefile had node).
    // Using --loader:.css=file to ensure esbuild doesn't error on any accidental css imports, 
    // though we expect none if stripping works well.
    execSync('npx esbuild build/modules/exports.js --bundle --platform=node --outfile=build/ltng-framework-all.esbuild.min.js --minify --format=esm --loader:.css=file', {
        cwd: ROOT,
        stdio: 'inherit'
    });
} catch (e) {
    console.error('JS Build failed');
    process.exit(1);
}

// 3. Post-process JS
console.log('Post-processing JS...');
const jsBundlePath = path.join(BUILD_DIR, 'ltng-framework-all.esbuild.min.js');
let jsContent = fs.readFileSync(jsBundlePath, 'utf8');

// Regex to match window.loadCSS(new URL(..., import.meta.url).href);
// We match conservatively to avoid stripping wrong things. 
// The pattern used in source is `window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)`
// esbuild minifies this.
// Minified: window.loadCSS(new URL("../styles/theme.css",import.meta.url).href)
const loadCssRegex = /window\.loadCSS\(new URL\((['"`]).*?\1,import\.meta\.url\)\.href\);?/g;

// Verify count
const matchCount = (jsContent.match(loadCssRegex) || []).length;
console.log(`Found ${matchCount} loadCSS calls to strip.`);

if (matchCount > 0) {
    jsContent = jsContent.replace(loadCssRegex, '');
    
    // Inject the single CSS bundle loader
    // We append it to the end where window.loadCSS is definitely available.
    const bundleLoader = `window.loadCSS(new URL('./ltng-framework-all.esbuild.min.css', import.meta.url).href);`;
    jsContent += `\n${bundleLoader}`;
    
    fs.writeFileSync(jsBundlePath, jsContent);
    console.log('JS Bundle patched successfully.');
} else {
    console.warn('No loadCSS calls found to strip. Check regex or source.');
    // Still inject the loader just in case? Or is it a failure?
    // If no calls found, maybe they are already stripped or different syntax.
    // We'll append anyway to ensure styles load.
    const bundleLoader = `window.loadCSS(new URL('./ltng-framework-all.esbuild.min.css', import.meta.url).href);`;
    jsContent += `\n${bundleLoader}`;
    fs.writeFileSync(jsBundlePath, jsContent);
}
