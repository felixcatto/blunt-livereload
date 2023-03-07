import { createMachine, interpret } from 'xstate';
import { port } from '../main/config.js';
import { IWSDecodeReturn } from '../main/types.js';
import { encode, makeEnum, send, wsEvents } from '../main/utils.js';

const decode = objBuffer => JSON.parse(objBuffer.data.toString()) as IWSDecodeReturn;
const states = makeEnum('open', 'disconnected');
const connectionStates = makeEnum('pongReceived', 'pingSended');

let state: keyof typeof states = states.disconnected;
let connectionState: keyof typeof connectionStates = connectionStates.pongReceived;
let socket: WebSocket;
let intervalId;

const makeConnection = () => {
  socket = new WebSocket(`ws://localhost:${port}`);

  socket.addEventListener('open', () => {
    state = states.open;
    loop();
  });

  socket.addEventListener('close', () => {
    if (states.disconnected === state) {
      setTimeout(() => {
        makeConnection();
      }, 3000);
    } else if (states.open === state) {
      state = states.disconnected;
      stopActivity();
      loop();
    }
  });

  socket.addEventListener('message', buffer => {
    const { type, payload } = decode(buffer);
    switch (type) {
      case wsEvents.pong:
        connectionState = connectionStates.pongReceived;
        break;
      case wsEvents.windowReload:
        window.location.reload();
        break;
    }
  });
};

const startActivity = () => {
  return setInterval(() => {
    if (connectionStates.pongReceived === connectionState) {
      connectionState = connectionStates.pingSended;
      send(socket, wsEvents.ping);
    } else if (connectionStates.pingSended === connectionState) {
      console.log('Connection broken, trying to reconnect');
      connectionState = connectionStates.pongReceived;
      stopActivity();
      socket.close(); // go to disconnected state
    }
  }, 5000);
};

const stopActivity = () => clearInterval(intervalId);

const loop = () => {
  if (states.disconnected === state) {
    makeConnection();
  } else if (states.open === state) {
    console.log('LiveReload connected');
    intervalId = startActivity();
  }
};

loop();
