import fastifyStatic from '@fastify/static';
import fastifyWs from '@fastify/websocket';
import fy, { FastifyInstance } from 'fastify';
import { port } from './config.js';
import { IWSSDecodeReturn } from './types.js';
import { send, wsEvents } from './utils.js';

const decode = message => JSON.parse(message) as IWSSDecodeReturn;

const wss = async (fastify: FastifyInstance) => {
  const broadcast = (eventType, payload = '') => {
    fastify.websocketServer.clients.forEach(socket => {
      send(socket, eventType, payload);
    });
  };

  fastify.get('/', { websocket: true }, (connection, req) => {
    connection.socket.on('message', buffer => {
      const message = buffer.toString();
      if (message === wsEvents.ping) {
        return connection.socket.send(wsEvents.pong);
      }

      const { type, payload } = decode(buffer);
      switch (type) {
        case wsEvents.notifyWindowReload:
          broadcast(wsEvents.windowReload);
          break;
      }
    });
  });
};

export const makeLrServer = ({ staticPath = null } = {}) => {
  const app = fy();
  if (staticPath) {
    app.register(fastifyStatic, { root: staticPath });
  }

  app.register(fastifyWs, {
    errorHandler: (error, conn) => {
      console.log(error);
      conn.destroy(error);
    },
    options: { clientTracking: true },
  });

  app.register(wss);

  return app;
};

export const listen = async app => {
  const address = await app.listen({ port });
  console.log(`lrServer listening on ${address}`);
};
