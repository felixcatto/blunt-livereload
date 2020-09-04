import fastify from 'fastify';
import fastifyWs from 'fastify-websocket';
import { port } from './config.js';

export const makeServer = () => {
  const app = fastify();
  app.register(fastifyWs, { handle: () => {}, options: { clientTracking: true } });

  app.reloadBrowser = () => {
    [...app.websocketServer.clients].forEach(client => client.send('reloadBrowser'));
  };

  return app;
};

export const listen = async app => {
  const address = await app.listen(port);
  console.log(`dev server listening on ${address}`);
};
