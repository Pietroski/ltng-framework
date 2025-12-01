# Main Makefile

test-pkg:
	node pkg/verify.test.js

pv ?= 001 # playground_version
port ?= 3000

playground-csr:
	node ltng-server.js --src=playground/$(pv) --port=$(port) --mode=csr

playground-ssr:
	node ltng-server.js --src=playground/$(pv) --port=$(port) --mode=ssr

playground-ssg:
	node ltng-server.js --src=playground/$(pv) --build
	node ltng-server.js --src=playground/$(pv) --port=$(port) --mode=ssg

build-pkg:
	node ltng-server.js --src=pkg/ltng-book --build

ltng-book:
	node ltng-server.js --src=pkg/ltng-book --port=$(port) --mode=csr
