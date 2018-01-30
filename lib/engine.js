"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memux = require("memux");
const Context = require("feedbackfruits-knowledge-context");
const doc_1 = require("./doc");
async function createSend(config) {
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    const sendFn = await memux.createSend({
        name: config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.OUTPUT_TOPIC,
        concurrency: config.CONCURRENCY,
        ssl
    });
    return async (operation) => {
        const { data } = operation;
        const compacted = await doc_1.default.compact(data, Context.context);
        const flattened = await doc_1.default.flatten(compacted, Context.context);
        return Promise.all(flattened.map(doc => {
            return sendFn(Object.assign({}, operation, { data: doc }));
        })).then(() => { });
    };
}
exports.createSend = createSend;
async function createReceive(config) {
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    const _receive = async (operation) => {
        const { data } = operation;
        const expanded = await doc_1.default.expand(data, Context.context);
        return config.receive(config.send)(Object.assign({}, operation, { data: expanded }));
    };
    return memux.createReceive({
        name: config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.INPUT_TOPIC,
        receive: _receive,
        concurrency: config.CONCURRENCY,
        ssl
    });
}
exports.createReceive = createReceive;
