import { Operation } from 'memux';
import * as Engine from './engine';
import * as Config from './config';
import { Doc } from './doc';

export type BrokerOptions = {
  name: string;
  receive: (operation: Operation<Doc>) => Promise<void>;
  customConfig?: typeof Config.Base
};

export async function Broker({ name, receive, customConfig = {} }: BrokerOptions): Promise<void> {
  const config = Object.assign({}, Config.Base, Config.Broker, customConfig);
  const send: Engine.SendFn<Doc> = async (operation) => {};
  return (await Engine.createReceive({ ...config, send, receive: (send) => receive }));
}
