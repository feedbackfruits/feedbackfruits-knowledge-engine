import * as memux from 'memux';
import * as Context from 'feedbackfruits-knowledge-context';
import * as Config from './config';
import Doc from './doc';

export type EngineConfig = typeof Config.Base;

export type SendFn<T> = {
  (operation: memux.Operation<T>): Promise<void>
};

export type ReceiveFn<T> = {
  (send: SendFn<T>): (operation: memux.Operation<T>) => Promise<void>
};

export async function createSend(config: EngineConfig): Promise<SendFn<Doc>> {
  const ssl = {
    key: config.KAFKA_PRIVATE_KEY,
    cert: config.KAFKA_CERT,
    ca: config.KAFKA_CA,
  };

  // Create default send function with memux
  const sendFn = await memux.createSend({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    topic: config.OUTPUT_TOPIC,
    concurrency: config.CONCURRENCY,
    ssl
  });

  return async (operation: memux.Operation<Doc>) => {
    const { data } = operation;
    const compacted = await Doc.compact(data, Context.context);
    const flattened = await Doc.flatten(compacted, Context.context);

    return Promise.all(flattened.map(doc => {
      return sendFn({ ...operation, data: doc });
    })).then(() => {});
  };
}

export async function createReceive(config: EngineConfig & { send: SendFn<Doc>, receive: ReceiveFn<Doc> }): Promise<void> {
  const ssl = {
    key: config.KAFKA_PRIVATE_KEY,
    cert: config.KAFKA_CERT,
    ca: config.KAFKA_CA,
  };

  const _receive = async (operation: memux.Operation<Doc>): Promise<void> => {
    const { data } = operation;
    const expanded = await Doc.expand(data, Context.context);

    return config.receive(config.send)({ ...operation, data: expanded });
  }

  return memux.createReceive({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    topic: config.INPUT_TOPIC,
    receive: _receive,
    concurrency: config.CONCURRENCY,
    ssl
  });
}
