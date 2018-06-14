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
        const flattened = await doc_1.default.flatten(data, Context.context);
        console.log('Flattening operation...');
        console.log('Sending all flattened docs:', flattened);
        await Promise.all(flattened.map(async (doc) => {
            if (!(typeof doc["@id"] === 'string'))
                throw new Error(`Trying to send a doc without an @id`);
            const compacted = await doc_1.default.compact(doc, Context.context);
            await doc_1.default.validate(compacted, Context.context);
            return sendFn(Object.assign({}, operation, { data: compacted, key: compacted["@id"] }));
        }));
    };
}
exports.createSend = createSend;
async function createReceive(config) {
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    const receiver = await config.receive(config.send);
    const _receive = async (operation) => {
        const { data } = operation;
        const flattened = await doc_1.default.flatten(data, Context.context);
        const expanded = await doc_1.default.expand(flattened, Context.context);
        await Promise.all(expanded.map(async (doc) => {
            return receiver(Object.assign({}, operation, { data: doc }));
        }));
        return;
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
