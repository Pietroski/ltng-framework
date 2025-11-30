# ltng-framework Architecture & Design Overview

This document explains the core architectural decisions and how the different rendering modes (CSR, SSR, SSG) work under the hood.

## 1. Core Philosophy
The goal was to create a **lightweight, vanilla JavaScript framework** that supports modern features (Components, State Management, Universal Rendering) without a build step (transpilation) or external dependencies.

## 2. Rendering Modes

The `ltng-server.js` script acts as a universal server/builder. It switches behavior based on the `--mode` flag.

### A. Client-Side Rendering (CSR)
**Command**: `node ltng-server.js --mode=csr`

**How it works**:
1.  **Server**: Simply serves the **raw** `.html` files from your project root.
2.  **Browser**: Receives an HTML file with an empty body (except for `<script>` tags).
3.  **Browser**: Executes the JavaScript.
4.  **Framework**: `Body.render()` runs, creates DOM elements, and appends them to the document.

**Code Location**:
In `ltng-server.js`, this falls into the `else` block when `mode !== 'ssr'`:
```javascript
// CSR or SSG Mode: Serve static HTML
const content = fs.readFileSync(filePath); // Reads ./index.html
res.end(content);
```

### B. Server-Side Rendering (SSR)
**Command**: `node ltng-server.js --mode=ssr` (Default)

**How it works**:
1.  **Server**: Intercepts the request.
2.  **Mock DOM**: Creates a fresh, isolated DOM environment (`mock-dom.js`) for *that specific request*.
3.  **Execution**: Runs your client-side code (`ltng-framework.js`, `index.html` scripts) inside a Node.js VM sandbox.
4.  **Capture**: The framework renders components into the mock `document.body`.
5.  **Injection**: The server extracts the `<script>` tags from the original file and injects them back into the rendered HTML.
6.  **Response**: Sends the fully populated HTML to the browser.
7.  **Hydration**: The browser displays the content immediately. Then, the scripts run again (Auto-Hydration) to attach event listeners.

### C. Static Site Generation (SSG)
**Command**: `node ltng-server.js --build` (Build) / `node ltng-server.js --mode=ssg` (Serve)

**How it works**:
1.  **Build**: Iterates over all `.html` files.
2.  **Render**: Performs the **SSR** process described above for each file.
3.  **Save**: Writes the result to the `dist/` directory.
4.  **Optimize**: Scans for used assets (`.js`, `.css`) and copies only them to `dist/`.
5.  **Serve**: The server simply acts as a static file server pointing to the `dist/` directory.

## 3. Key Technical Decisions

### Auto-Hydration
**Problem**: SSR sends full HTML. CSR (client script) normally appends content. If we just ran the client script on top of SSR HTML, we'd get duplicate content (double rendering).
**Solution**: `Body.render` has a flag `isHydrated`.
-   **First Call**: It detects it's the first render. It **clears** the body (removing SSR static content).
-   **Subsequent Calls**: It appends content.
This "Nuke and Pave" strategy is simple and robust for this scale, ensuring the client state (event listeners) creates a fresh, interactive DOM that looks identical to the server output.

### Mock DOM (`mock-dom.js`)
**Problem**: Node.js doesn't have `document` or `window`.
**Solution**: Created a minimal implementation of the DOM API (`createElement`, `appendChild`, `createTextNode`, etc.) purely in JS.
**Isolation**: Crucially, we export a `createWindow()` factory. This ensures every SSR request gets a **brand new** DOM. If we reused a global `document`, User A's state would leak into User B's request (State Pollution).

### Universal Code
The exact same `ltng-framework.js` and `index.html` run on both the Server (Node.js + Mock DOM) and the Client (Browser). This is achieved by:
1.  Avoiding browser-specific APIs (like `alert`) in the core render path.
2.  Polyfilling necessary globals (`window`, `document`) on the server.
