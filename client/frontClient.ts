import { interpret } from 'xstate';
import { port } from '../main/config.js';
import { IWSDecodeReturn } from '../main/types.js';
import { events, makeSocketMachine, wsEvents } from '../main/utils.js';

const decode = message => JSON.parse(message) as IWSDecodeReturn;

const connectToWss = () => new WebSocket(`ws://localhost:${port}`);
const addEventListener = (webSocket: WebSocket, event, handler) =>
  webSocket.addEventListener(event, handler);
const bufferToString = buffer => buffer.data.toString();

const actor = interpret(makeSocketMachine(connectToWss, addEventListener, bufferToString));

actor.subscribe(state => {
  if (events.MESSAGE === state.event.type) {
    const { type } = decode(state.event.data);
    switch (type) {
      case wsEvents.windowReload:
        window.location.reload();
        break;
    }
  }
  if (events.OPEN === state.event.type) {
    console.log('LiveReload connected');
  }
});

actor.start();
