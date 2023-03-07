import { wsEvents } from './utils.js';

export type IMakeEnum = <T extends ReadonlyArray<string>>(
  ...args: T
) => { [key in T[number]]: key };

export type IWsEvents = typeof wsEvents;

export type IWSSDecodeReturn =
  | {
      type: IWsEvents['ping'];
      payload: any;
    }
  | {
      type: IWsEvents['notifyWindowReload'];
      payload: any;
    };

export type IWSDecodeReturn =
  | {
      type: IWsEvents['pong'];
      payload: any;
    }
  | {
      type: IWsEvents['windowReload'];
      payload: any;
    };
