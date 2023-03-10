import { actions, AnyActorRef, assign, createMachine, forwardTo, spawn } from 'xstate';
import { IAddEventListener, IConnectToWss, IMakeEnum } from '../main/types.js';

export const makeEnum: IMakeEnum = (...args) =>
  args.reduce((acc, key) => ({ ...acc, [key]: key }), {} as any);

export const encode = (wsEvent, message = '') =>
  JSON.stringify({ type: wsEvent, payload: message });

export const send = (webSocket, wsEvent, message = '') => webSocket.send(encode(wsEvent, message));

export const wsEvents = makeEnum('ping', 'pong', 'windowReload', 'notifyWindowReload');

type IEvent = keyof typeof events;
const { stop } = actions;
const states = makeEnum('connecting', 'connectionError', 'open', 'pongReceived', 'pingSended');
export const events = makeEnum('CLOSE', 'OPEN', 'MESSAGE', 'SEND_MESSAGE', 'PING', 'PONG');

export const makeEvent = (event: IEvent, data?) =>
  typeof data === 'undefined' ? { type: event } : { type: event, data };

const makeWebSocketActor =
  (connectToWss: IConnectToWss, addEventListener: IAddEventListener, bufferToString) =>
  (sendBack, onReceive) => {
    const webSocket = connectToWss();

    addEventListener(webSocket, 'error', () => {});
    addEventListener(webSocket, 'open', () => sendBack(makeEvent(events.OPEN)));
    addEventListener(webSocket, 'close', () => sendBack(makeEvent(events.CLOSE)));
    addEventListener(webSocket, 'message', buffer => {
      const message = bufferToString(buffer);
      if (message === wsEvents.pong) {
        sendBack(makeEvent(events.PONG));
      } else {
        sendBack(makeEvent(events.MESSAGE, message));
      }
    });

    onReceive(e => {
      if (e.type === events.PING) {
        webSocket.send(wsEvents.ping);
      } else {
        webSocket.send(e.data);
      }
    });

    return () => webSocket.close();
  };

export const makeSocketMachine = (connectToWss, addEventListener, bufferToString) => {
  const webSocketActor = makeWebSocketActor(connectToWss, addEventListener, bufferToString);

  return createMachine(
    {
      id: 'root',
      predictableActionArguments: true,
      initial: states.connecting,
      context: { webSocketRef: null as any as AnyActorRef },
      entry: 'startWsActor',
      states: {
        [states.connecting]: {
          on: {
            [events.OPEN]: states.open,
            [events.CLOSE]: states.connectionError,
          },
        },
        [states.connectionError]: {
          entry: 'stopWsActor',
          after: {
            5000: {
              target: states.connecting,
              actions: 'startWsActor',
            },
          },
        },
        [states.open]: {
          initial: states.pongReceived,
          invoke: { src: 'pingActor' },
          on: {
            [events.SEND_MESSAGE]: { actions: forwardTo(ctx => ctx.webSocketRef) },
            [events.CLOSE]: `#root.${states.connectionError}`,
          },
          states: {
            [states.pongReceived]: {
              on: {
                [events.PING]: {
                  target: states.pingSended,
                  actions: forwardTo(ctx => ctx.webSocketRef),
                },
              },
            },
            [states.pingSended]: {
              on: {
                [events.PING]: `#root.${states.connectionError}`,
                [events.PONG]: states.pongReceived,
              },
            },
          },
        },
      },
    },
    {
      actions: {
        startWsActor: assign({ webSocketRef: () => spawn(webSocketActor) }),
        stopWsActor: stop((ctx: any) => ctx.webSocketRef),
      },
      services: {
        pingActor: (ctx, e) => (sendBack, onReceive) => {
          const id = setInterval(() => sendBack(makeEvent(events.PING)), 10000);
          return () => clearInterval(id);
        },
      },
    }
  );
};
