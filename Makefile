# Main Makefile

check-ltng-testingtools:
	node ltng-testingtools/index.test.mjs

test-ltng-tools:
	node ltng-tools/index.test.mjs

# Test ltng-tools folder
tf ?= converter
test-ltng-tools-folder:
	node ltng-tools/$(tf)/index.test.mjs

pv ?= 001 # playground_version
port ?= 3000

playground-csr:
	node scripts/ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=csr

playground-ssr:
	node scripts/ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=ssr

playground-ssg:
	node scripts/ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --build --mode=ssg
	node scripts/ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=ssg

minify:
	node scripts/minifier.js

ltng-book:
	node scripts/ltng-server.js --src=pkg/ltng-book --dist=dist/ltng-book --port=$(port) --mode=csr

ltng-book-ssg:
	node scripts/ltng-server.js --src=pkg/ltng-book --dist=dist/ltng-book --build --mode=ssg
	node scripts/ltng-server.js --src=pkg/ltng-book --dist=dist/ltng-book --port=$(port) --mode=ssg

bundle-server:
	npx esbuild scripts/ltng-server.js --bundle --platform=node --outfile=build/ltng-server.min.js --minify

bundle-ltng-framework:
	npx esbuild ltng-framework.js --bundle --platform=node --outfile=build/ltng-framework.esbuild.min.js --minify
