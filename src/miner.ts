import { Operation } from 'memux';
import * as Engine from './engine';
import * as Config from './config';
import { Doc } from './doc';

export type MinerOptions = {
  name: string;
  customConfig?: typeof Config.Base
};

export async function Miner({ name, customConfig = {} }: MinerOptions): Promise<(operation: Operation<Doc>) => Promise<void>> {
  const config = Object.assign({}, Config.Base, Config.Miner, customConfig);
  return await Engine.createSend(config);
}
