install:
	npm i

start:
	npx gulp dev

build:
	?

webpack-bundle:
	NODE_ENV=production npx wp

lint:
	npx eslint --quiet .

lint-fix:
	npx eslint --fix --quiet .

lint-with-warn:
	npx eslint .
