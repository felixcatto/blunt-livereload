import { IMakeEnum } from '../main/types.js';

export const makeEnum: IMakeEnum = (...args) =>
  args.reduce((acc, key) => ({ ...acc, [key]: key }), {} as any);

export const encode = (wsEvent, message = '') =>
  JSON.stringify({ type: wsEvent, payload: message });

export const send = (webSocket, wsEvent, message = '') => webSocket.send(encode(wsEvent, message));

export const wsEvents = makeEnum('ping', 'pong', 'windowReload', 'notifyWindowReload');
