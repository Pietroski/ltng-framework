# Main Makefile

test-pkg:
	node pkg/verify.test.js

playground-csr:
	node ltng-server.js --src=playground --port=3000 --mode=csr

playground-ssr:
	node ltng-server.js --src=playground --port=3000 --mode=ssr

playground-ssg:
	node ltng-server.js --src=playground --build
	node ltng-server.js --src=playground --port=3000 --mode=ssg

ltng-book:
	node ltng-server.js --src=pkg/ltng-book --port=3001 --mode=csr
