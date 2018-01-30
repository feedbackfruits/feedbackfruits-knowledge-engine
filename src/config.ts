// tslint:disable-next-line no-var-requires
require('dotenv').load({ silent: true });

// Miner config
export const Miner = {
  INPUT_TOPIC: undefined,
  OUTPUT_TOPIC: 'update_requests',
};

// Miner config
export const Annotator = {
  INPUT_TOPIC: 'updates',
  OUTPUT_TOPIC: 'update_requests',
};

// Broker config
export const Broker = {
  INPUT_TOPIC: 'updates',
  OUTPUT_TOPIC: undefined,
};

// Default values
const {
  NAME = 'feedbackfruits-knowledge-engine',

  CAYLEY_ADDRESS = 'http://localhost:64210',

  KAFKA_ADDRESS = 'tcp://localhost:9092',
  KAFKA_PRIVATE_KEY,
  KAFKA_CERT,
  KAFKA_CA,

  INPUT_TOPIC,
  OUTPUT_TOPIC,
} = Object.assign({}, process.env);

const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 8;

export const Base = {
  NAME,

  CAYLEY_ADDRESS,

  KAFKA_ADDRESS,
  KAFKA_PRIVATE_KEY,
  KAFKA_CERT,
  KAFKA_CA,

  INPUT_TOPIC,
  OUTPUT_TOPIC,
  CONCURRENCY,
};
