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
  const sendFn = await memux.createSend<Doc>({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    topic: config.OUTPUT_TOPIC,
    concurrency: config.CONCURRENCY,
    ssl
  });

  return async (operation: memux.Operation<Doc>) => {
    const { data } = operation;
    // const compacted = await Doc.compact(data, Context.context);
    // return sendFn({ ...operation, key: compacted["@id"], data: compacted });
    const flattened = await Doc.flatten(data, Context.context);
    console.log('Flattening operation...');

    console.log('Sending all flattened docs:', flattened);
    await Promise.all(flattened.map(async doc => {
      // console.log('Mapping with send');
      if (!(typeof doc["@id"] === 'string')) throw new Error(`Trying to send a doc without an @id`);
      const compacted = await Doc.compact(doc, Context.context);

      await Doc.validate(compacted, Context.context); // This will throw an Error is doc is invalid

      return sendFn({ ...operation, data: compacted, key: compacted["@id"] });
    }));

    // console.log('Done sending...');
  };
}

export async function createReceive(config: EngineConfig & { send: SendFn<Doc>, receive: ReceiveFn<Doc> }): Promise<void> {
  const ssl = {
    key: config.KAFKA_PRIVATE_KEY,
    cert: config.KAFKA_CERT,
    ca: config.KAFKA_CA,
  };

  const receiver = await config.receive(config.send);
  const _receive = async (operation: memux.Operation<Doc>): Promise<void> => {
    const { data } = operation;
    const flattened = await Doc.flatten(data, Context.context);
    const expanded = await Doc.expand(flattened, Context.context);

    await Promise.all(expanded.map(async (doc) => {
      return receiver({ ...operation, data: doc });
    }));

    return;
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
