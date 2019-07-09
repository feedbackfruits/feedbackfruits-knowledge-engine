import { Operation } from 'memux';
import * as Engine from './engine';
import * as Config from './config';
import { Doc } from './doc';

export type AnnotatorOptions = {
  name: string;
  receive: (send: Engine.SendFn<Doc>) => (operation: Operation<Doc>) => Promise<void>;
  customConfig?: typeof Config.Base
};

export async function Annotator({ name, receive, customConfig = {} as typeof Config.Base }: AnnotatorOptions): Promise<void> {
  const config = Object.assign({}, Config.Base, Config.Annotator, customConfig);
  const send = await Engine.createSend(config);
  return await Engine.createReceive({ ...config, send, receive });
}
