// tslint:disable-next-line no-var-requires
require('dotenv').load({ silent: true });

// Miner config
export const Miner = {
  INPUT_TOPIC: undefined,
  OUTPUT_TOPIC: 'quad_update_requests',
};

// Miner config
export const Annotator = {
  INPUT_TOPIC: 'quad_updates',
  OUTPUT_TOPIC: 'quad_update_requests',
};

// Broker config
export const Broker = {
  INPUT_TOPIC: 'quad_update_requests',
  OUTPUT_TOPIC: 'quad_updates',
};

// Default values
const {
  NAME = 'feedbackfruits-knowledge-engine',
  KAFKA_ADDRESS = 'tcp://kafka:9092',

  INPUT_TOPIC,
  OUTPUT_TOPIC,

} = Object.assign({}, process.env);

export const Base = {
  NAME,
  KAFKA_ADDRESS,
  INPUT_TOPIC,
  OUTPUT_TOPIC,
};
