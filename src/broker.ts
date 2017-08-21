import { createReceive, createSend, MemuxConfig, Operation } from 'memux';
import * as Config from './config';
import { Doc } from './doc';

export type BrokerOptions = {
  name: string;
  receive: (operation: Operation<Doc>) => Promise<void>;
  customConfig?: typeof Config.Base
};

export async function Broker({ name, receive, customConfig = {} }: BrokerOptions): Promise<void> {
  const config = Object.assign({}, Config.Broker, Config.Base, customConfig);

  const ssl = {
    key: config.KAFKA_PRIVATE_KEY,
    cert: config.KAFKA_CERT,
    ca: config.KAFKA_CA,
  };

  return createReceive({
    name: name || config.NAME,
    url: config.KAFKA_ADDRESS,
    topic: config.INPUT_TOPIC,
    receive,
    ssl
  });
}
