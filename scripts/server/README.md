# ltng-server

The `ltng-server` is the CLI tool for building and serving `ltng-framework` applications. It supports Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).

## Usage

The server script is located at `scripts/ltng-server.js`.

```bash
node scripts/ltng-server.js [options]
```

## Options

- **`--mode=<mode>`**: Sets the rendering mode.
  - `csr` (default): Client-Side Rendering. Serves static files and `index.html`.
  - `ssr`: Server-Side Rendering. Renders the app on the server for each request.
  - `ssg`: Static Site Generation. Builds static HTML files (requires `--build`).
- **`--port=<number>`**: Sets the port number (default: 3000).
- **`--src=<path>`**: Sets the source directory (default: current directory).
- **`--dist=<path>`**: Sets the distribution/output directory (default: `dist` in current directory).
- **`--build`**: Runs the build process (only for SSG).
- **`--serve`**: Serves the application.
- **`--b&s`**: Runs both build and serve (only for SSG).

## Examples

### CSR (Client-Side Rendering)
Serve the playground in CSR mode on port 3000.
```bash
node scripts/ltng-server.js --src=playground/001 --mode=csr --port=3000
```

### SSR (Server-Side Rendering)
Serve the playground in SSR mode.
```bash
node scripts/ltng-server.js --src=playground/001 --mode=ssr --port=3000
```

### SSG (Static Site Generation)
Build and serve the playground as a static site.
```bash
# Build only
node scripts/ltng-server.js --src=playground/001 --dist=dist/playground/001 --build --mode=ssg

# Serve only (after build)
node scripts/ltng-server.js --src=playground/001 --dist=dist/playground/001 --serve --mode=ssg --port=3000
```

## Architecture

The server logic is split into:
- `csr.js`: Handles static file serving for CSR.
- `ssr.js`: Handles dynamic HTML generation for SSR.
- `ssg.js`: Handles static site generation and serving.

The main entry point `ltng-server.js` parses arguments and dispatches to the appropriate handler.
