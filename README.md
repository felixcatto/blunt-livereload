# Description

Simple livereload server. 20 linesOfCode on server and 2  LoC on client :fire:

Usage with gulp

```
import gulp from 'gulp';
import { makeServer, listen } from './server.js';

const devServer = makeServer();
const startDevServer = async () => listen(devServer);
const reloadBrowser = async () => devServer.reloadBrowser();

const watch = done => {
  gulp.watch('server.js', reloadBrowser);
  done();
};

export const dev = gulp.series(startDevServer, watch);
```

Also you can serve static content with it
```
const devServer = makeServer({ staticPath: path.resolve(__dirname, 'dist/public') });
```
