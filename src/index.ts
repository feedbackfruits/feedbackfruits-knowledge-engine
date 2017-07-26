import memux, { MemuxConfig, Actionable, Progressable, Readable, Duplex } from 'memux';
import { Observable } from '@reactivex/rxjs';

import * as Context from 'feedbackfruits-knowledge-context';
import * as Config from './config';

const log = console.log.bind(console);

export type Miner = Readable<Actionable & Progressable>;
export type MinerOptions = {
  name: string;
  readable: Readable<Actionable>
};
export function Miner({ name, readable }: MinerOptions): Miner {
  const config = Object.assign({}, Config.Base, Config.Miner);

  const { producer } = memux({
    name: name || config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  } as MemuxConfig);

  readable.source.subscribe(producer.sink);
  return {
    source: producer.source
  };
}

export type Annotator = Readable<Actionable & Progressable>;
export type AnnotatorOptions = {
  name: string;
  transform: <T extends Actionable>(value: T) => T;
  duplex: Duplex<Actionable & Progressable, Actionable & Progressable>;
};
export function Annotator({ name, transform, duplex }: AnnotatorOptions): Annotator {
  const config = Object.assign({}, Config.Base, Config.Annotator);

  const { consumer, producer } = memux({
    name: name || config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  } as MemuxConfig);

  const transformed = consumer.source.flatMap(async (value) => {
    return transform(value);
    // return { action: transformedAction, progress };
  });

  transformed.subscribe(consumer.sink);
  transformed.subscribe(producer.sink);

  consumer.source.subscribe(duplex.sink);
  duplex.source.subscribe(consumer.sink);

  // Read the consumer source
  //
  // const transformed = actions.map(transform);
  // const zipped = Observable.zip(transformed, progresses);
  //
  //
  // zipped.map(([, progress ]) => progress).subscribe(consumer.sink);
  //
  // // Connect the annotator output to the producer
  // zipped.map(([ action ]) => action).subscribe(producer.sink);

  return {
    source: producer.source
  };
}

export type Broker = Readable<Actionable & Progressable>;
export type BrokerOptions = {
  name: string;
  // transform: (Action) => Action
  duplex: Duplex<Actionable, Actionable>;
};
export function Broker({ name, duplex }): Broker {
  const config = Object.assign({}, Config.Base, Config.Broker);

  const { consumer, producer } = memux({
    name: name || config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  } as MemuxConfig);

  // Read the consumer source
  // const actions = consumer.source.map(([ action ]) => action);
  // const progresses = consumer.source.map(([ , progress ]) => progress);

  // const transformed = actions.map(transform);
  // const zipped = Observable.zip(transformed, progresses);
  //
  // zipped.map(([, progress ]) => progress).subscribe(consumer.sink);
  //
  // // Connect the annotator output to the producer
  // zipped.map(([ action ]) => action).subscribe(producer.sink);

  return {
    source: producer.source
  };
}

// export default {
//   Miner,
//   Annotator,
//   Broker,
// };
