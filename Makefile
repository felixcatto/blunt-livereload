install:
	npm i

build:
	rm -rf dist
	NODE_ENV=production npx wp
	npx babel --out-dir=dist src/server.js
	npx babel --out-dir=dist src/config.js

publish:
	npm publish --access public

lint:
	npx eslint --quiet .

lint-fix:
	npx eslint --fix --quiet .

lint-with-warn:
	npx eslint .
