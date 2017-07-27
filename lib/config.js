"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load({ silent: true });
exports.Miner = {
    INPUT_TOPIC: undefined,
    OUTPUT_TOPIC: 'quad_update_requests',
};
exports.Annotator = {
    INPUT_TOPIC: 'quad_updates',
    OUTPUT_TOPIC: 'quad_update_requests',
};
exports.Broker = {
    INPUT_TOPIC: 'quad_update_requests',
    OUTPUT_TOPIC: 'quad_updates',
};
const { NAME = 'feedbackfruits-knowledge-engine', KAFKA_ADDRESS = 'tcp://kafka:9092', INPUT_TOPIC, OUTPUT_TOPIC, } = Object.assign({}, process.env);
exports.Base = {
    NAME,
    KAFKA_ADDRESS,
    INPUT_TOPIC,
    OUTPUT_TOPIC,
};
