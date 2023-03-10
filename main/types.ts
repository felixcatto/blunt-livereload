import { wsEvents } from './utils.js';

export type IMakeEnum = <T extends ReadonlyArray<string>>(
  ...args: T
) => { [key in T[number]]: key };

export type IWsEvents = typeof wsEvents;

export type IWSSDecodeReturn = {
  type: IWsEvents['notifyWindowReload'];
  payload: any;
};

export type IWSDecodeReturn = {
  type: IWsEvents['windowReload'];
  payload: any;
};

export type IConnectToWss = () => WebSocket;
export type IAddEventListener = (webSocket: WebSocket, event, handler) => void;
