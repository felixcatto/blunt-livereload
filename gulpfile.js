import { makeLrServer, listen, makeBackClient } from './dist/index.js';
import { port } from './dist/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { deleteAsync } from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import webpack from 'webpack';
import babelConfig from './babelconfig.js';
import webpackConfig from './webpack.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { series, parallel } = gulp;

const paths = {
  dest: 'dist',
  public: { src: 'test/**/*' },
  serverJs: { src: 'main/**/*' },
};

const clean = async () => deleteAsync(['dist']);

const startLrServer = async () => {
  const lrServer = makeLrServer();
  return listen(lrServer);
};

const backClient = makeBackClient();
const reloadBrowser = async () => {
  backClient.notifyWindowReload();
};

const copyPublic = () => gulp.src(paths.public.src).pipe(gulp.dest(paths.dest));
const copyPublicDev = () =>
  gulp.src(paths.public.src, { since: gulp.lastRun(copyPublicDev) }).pipe(gulp.dest(paths.dest));

const transpileServerJs = () =>
  gulp
    .src(paths.serverJs.src, { base: '.', since: gulp.lastRun(transpileServerJs) })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.dest));

const compiler = webpack(webpackConfig);
const startWebpack = done => {
  compiler.hooks.done.tap('done', async () => reloadBrowser());
  compiler.watch({}, done);
};
const bundleClient = done => compiler.run(done);

const trackChangesInDist = () => {
  const watcher = gulp.watch('dist/**/*');
  watcher
    .on('add', pathname => console.log(`File ${pathname} was added`))
    .on('change', pathname => console.log(`File ${pathname} was changed`))
    .on('unlink', pathname => console.log(`File ${pathname} was removed`));
};

const watch = async () => {
  gulp.watch(paths.public.src, series(copyPublicDev, reloadBrowser));
  trackChangesInDist();
};

export const client = series(copyPublicDev, startWebpack, watch);

export const server = series(startLrServer);
