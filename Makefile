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
	node ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=csr

playground-ssr:
	node ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=ssr

playground-ssg:
	node ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --build
	node ltng-server.js --src=playground/$(pv) --dist=dist/playground/$(pv) --port=$(port) --mode=ssg

build:
	node scripts/build.js

ltng-book:
	node ltng-server.js --src=pkg/ltng-book --dist=dist/ltng-book --port=$(port) --mode=csr
