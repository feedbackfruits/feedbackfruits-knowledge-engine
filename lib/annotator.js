"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memux_1 = require("memux");
const Config = require("./config");
async function Annotator({ name, receive, customConfig = {} }) {
    const config = Object.assign({}, Config.Base, Config.Annotator, customConfig);
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    const send = await memux_1.createSend({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.OUTPUT_TOPIC,
        concurrency: config.CONCURRENCY,
        ssl
    });
    async function _receive(operation) {
        return receive(send)(operation);
    }
    return memux_1.createReceive({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.INPUT_TOPIC,
        receive: _receive,
        concurrency: config.CONCURRENCY,
        ssl
    });
}
exports.Annotator = Annotator;
