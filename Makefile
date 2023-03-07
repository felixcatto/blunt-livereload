install:
	npm i

prepare:
	rm -rf dist
	npx babel --out-dir="dist" --extensions=".ts" main

start-client:
	npx gulp client

start-server:
	npx gulp server

build:
	rm -rf dist
	NODE_ENV=production npx webpack
	npx babel --out-dir="dist" --extensions=".ts" main

webpack-bundle:
	npx webpack

servar-bundle:
	npx babel --out-dir="dist" --extensions=".ts" main

publish:
	npm publish --access public

lint:
	npx tsc
