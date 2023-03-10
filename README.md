## Description

Live Reload script, mainly designed for usage in programmatic environments like Gulp.

## How it works:

It contains 3 entities - LiveReloadServer, FrontClient, BackClient. You start liveReloadServer and BackClient, and include FrontClient script in your html file. Now whenever you change your html/css or bundle new js file, BackClient sends signal to LiveReloadServer, which sends signal to FrontClient in your html page in browser - 'hey, new content available, pls reload'. Then browser automatically reloads, and you see new content, without the need to press F5.

You can detect changes in your html/css/js files via gulp. Also webpack have watch functionality. So you can send liveReload signals when gulp/webpack are finished processing files.

## Installation

`npm i -D blunt-livereload`

## Simple gulp example

**gulpfile.js**

```
const { listen, makeBackClient, makeLrServer } = require('blunt-livereload');
const gulp = require('gulp');

const { series } = gulp;

const startLrServer = async () => {
  const lrServer = makeLrServer();
  return listen(lrServer);
};

const backClient = makeBackClient();
const reloadBrowser = async () => backClient.notifyWindowReload();

const paths = {
  dest: 'build',
  public: { src: 'src/**/*' },
};

const copyPublic = () =>
  gulp.src(paths.public.src, { since: gulp.lastRun(copyPublic) }).pipe(gulp.dest(paths.dest));

const watch = async () => {
  gulp.watch(paths.public.src, series(copyPublic, reloadBrowser));
};

const start = series(startLrServer, watch);

module.exports = { start };
```

**index.html**

```
<!DOCTYPE html>
<html lang="en">
...
  <body>
    ...
    <script src="/frontClient.js"></script>
  </body>
</html>
```
Copy `frontClient.js` from `node_modules/blunt-livereload/dist/frontClient.js` to your public folder

Then type `npx gulp start`

## Gulp + Webpack example

**gulpfile.js** - almost same

```
import { listen, makeBackClient, makeLrServer } from 'blunt-livereload';
import gulp from 'gulp';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';

const { series } = gulp;

const startLrServer = async () => {
  const lrServer = makeLrServer();
  return listen(lrServer);
};

const backClient = makeBackClient();
const reloadBrowser = async () => backClient.notifyWindowReload();

const compiler = webpack(webpackConfig);
const startWebpackWatch = done => {
  compiler.hooks.done.tap('done', async () => reloadBrowser());
  compiler.watch({}, done);
};

export const start = series(startLrServer, startWebpackWatch);
```

**webpack.config.js**

<pre><code>
const common = {
  entry: { index: ... },
  ...
};

let config;
if (process.env.NODE_ENV === 'production') {
  config = {
    ...common,
    mode: 'production',
  };
} else {
  <b>common.entry.index = ['blunt-livereload/dist/frontClient', common.entry.index];</b>
  config = {
    ...common,
    mode: 'development',
  };
}

export default config;
</code></pre>

Then type `npx gulp start`
