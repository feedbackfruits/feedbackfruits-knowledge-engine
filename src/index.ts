import memux from 'memux';

import * as Context from 'feedbackfruits-knowledge-context';
import * as Config from './config';

const log = console.log.bind(console);

function Miner({ name, observable }) {
  const config = Object.assign({}, Config.Base, Config.Miner);

  const { sink } = memux({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  });

  return observable.subscribe(sink);
}

function Annotator({ name, subject }) {
  const config = Object.assign({}, Config.Base, Config.Miner);

  const { source, sink } = memux({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  });

  source.subscribe(subject);
  return subject.subscribe(sink);
}

function Broker({ name, observable, subject }) {
  const config = Object.assign({}, Config.Base, Config.Miner);

  const { source, sink } = memux({
    name: config.NAME,
    url: config.KAFKA_ADDRESS,
    output: config.OUTPUT_TOPIC
  });

  observable.subscribe(sink);

  source.subscribe(subject);
  subject.subscribe(sink);

}

export default {
  Miner,
  Annotator,
  Broker,
};
