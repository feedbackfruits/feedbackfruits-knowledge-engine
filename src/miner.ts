import { createReceive, createSend, MemuxConfig, Operation } from 'memux';
import * as Config from './config';
import { Doc } from './doc';

export type MinerOptions = {
  name: string;
  customConfig?: typeof Config.Base
};

export async function Miner({ name, customConfig = {} }: MinerOptions): Promise<(operation: Operation<Doc>) => Promise<void>> {
  const config = Object.assign({}, Config.Miner, Config.Base, customConfig);

  const ssl = {
    key: config.KAFKA_PRIVATE_KEY,
    cert: config.KAFKA_CERT,
    ca: config.KAFKA_CA,
  };

  return createSend({
    name: name || config.NAME,
    url: config.KAFKA_ADDRESS,
    topic: config.OUTPUT_TOPIC,
    concurrency: config.CONCURRENCY,
    ssl
  });
}
