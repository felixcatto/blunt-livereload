import WebSocket from 'ws';
import { port } from './config.js';
import { send, wsEvents } from './utils.js';

export const makeBackClient = () => {
  let socket;
  socket = new WebSocket(`ws://localhost:${port}`);
  socket.on('error', error => console.log(error));

  return {
    notifyWindowReload: () => {
      send(socket, wsEvents.notifyWindowReload);
    },
  };
};
