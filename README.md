# Description

Simple livereload server. 20 linesOfCode on server and 2 LoC on client :fire:

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

Don't forget to add client script to your html file.

```
<script src="blunt-livereload/dist/client.js"></script>
```

but you need to manually copy it from node_modules to your assets folder

In webpack you can do like this

```
entry: {
  index: ['blunt-livereload/dist/client', path.resolve(__dirname, 'src/index.js')],
},
```
