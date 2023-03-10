import gulp from 'gulp';
import webpack from 'webpack';
import { listen, makeBackClient, makeLrServer } from './dist/index.js';
import webpackConfig from './webpack.config.js';

const { series, parallel } = gulp;

const paths = {
  dest: 'dist',
  public: { src: 'test/**/*' },
  serverJs: { src: 'main/**/*' },
};

const startLrServer = async () => {
  const lrServer = makeLrServer();
  return listen(lrServer);
};

const backClient = makeBackClient();
const reloadBrowser = async () => backClient.notifyWindowReload();

const copyPublic = () =>
  gulp.src(paths.public.src, { since: gulp.lastRun(copyPublic) }).pipe(gulp.dest(paths.dest));

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
  gulp.watch(paths.public.src, series(copyPublic, reloadBrowser));
  trackChangesInDist();
};

export const client = series(copyPublic, startWebpack, watch);

export const server = series(startLrServer);
