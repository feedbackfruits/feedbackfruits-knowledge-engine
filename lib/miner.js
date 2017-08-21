"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memux_1 = require("memux");
const Config = require("./config");
async function Miner({ name, customConfig = {} }) {
    const config = Object.assign({}, Config.Miner, Config.Base, customConfig);
    const ssl = {
        key: config.KAFKA_PRIVATE_KEY,
        cert: config.KAFKA_CERT,
        ca: config.KAFKA_CA,
    };
    return memux_1.createSend({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        topic: config.OUTPUT_TOPIC,
        concurrency: config.CONCURRENCY,
        ssl
    });
}
exports.Miner = Miner;
