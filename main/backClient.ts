import WebSocket from 'ws';
import { interpret } from 'xstate';
import { port } from './config.js';
import { encode, events, makeEvent, makeSocketMachine, wsEvents } from './utils.js';

const connectToWss = () => new WebSocket(`ws://localhost:${port}`);
const addEventListener = (webSocket: WebSocket, event, handler) => webSocket.on(event, handler);
const bufferToString = buffer => buffer.toString();

const actor = interpret(makeSocketMachine(connectToWss, addEventListener, bufferToString));

export const makeBackClient = () => {
  actor.start();

  return {
    notifyWindowReload: () => {
      actor.send(makeEvent(events.SEND_MESSAGE, encode(wsEvents.notifyWindowReload)));
    },
  };
};
