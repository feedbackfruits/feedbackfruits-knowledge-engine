"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memux_1 = require("memux");
const Config = require("./config");
async function Broker({ name, receive, customConfig = {} }) {
    const config = Object.assign({}, Config.Broker, Config.Base, customConfig);
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    return memux_1.createReceive({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.INPUT_TOPIC,
        receive,
        ssl
    });
}
exports.Broker = Broker;
