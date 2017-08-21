"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load({ silent: true });
exports.Miner = {
    INPUT_TOPIC: undefined,
    OUTPUT_TOPIC: 'update_requests',
};
exports.Annotator = {
    INPUT_TOPIC: 'updates',
    OUTPUT_TOPIC: 'update_requests',
};
exports.Broker = {
    INPUT_TOPIC: 'updates',
    OUTPUT_TOPIC: undefined,
};
const { NAME = 'feedbackfruits-knowledge-engine', KAFKA_ADDRESS = 'tcp://localhost:9092', KAFKA_PRIVATE_KEY, KAFKA_CERT, KAFKA_CA, INPUT_TOPIC, OUTPUT_TOPIC, } = Object.assign({}, process.env);
const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 8;
exports.Base = {
    NAME,
    KAFKA_ADDRESS,
    KAFKA_PRIVATE_KEY,
    KAFKA_CERT,
    KAFKA_CA,
    INPUT_TOPIC,
    OUTPUT_TOPIC,
    CONCURRENCY,
};
