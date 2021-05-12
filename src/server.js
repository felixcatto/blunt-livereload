import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyWs from 'fastify-websocket';
import { port } from './config';

export const makeServer = ({ staticPath }) => {
  const app = fastify();
  app.register(fastifyWs, { handle: () => {}, options: { clientTracking: true } });
  if (staticPath) {
    app.register(fastifyStatic, { root: staticPath });
  }

  app.reloadBrowser = () => {
    [...app.websocketServer.clients].forEach(client => client.send('reloadBrowser'));
  };

  return app;
};

export const listen = async app => {
  const address = await app.listen(port);
  console.log(`dev server listening on ${address}`);
};
