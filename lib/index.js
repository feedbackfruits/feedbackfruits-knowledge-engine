"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memux_1 = require("memux");
const Config = require("./config");
const log = console.log.bind(console);
function Miner({ name, readable }) {
    const config = Object.assign({}, Config.Base, Config.Miner);
    const { producer } = memux_1.default({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        output: config.OUTPUT_TOPIC
    });
    readable.source.subscribe(producer.sink);
    return {
        source: producer.source
    };
}
exports.Miner = Miner;
function Annotator({ name, transform, duplex }) {
    const config = Object.assign({}, Config.Base, Config.Annotator);
    const { consumer, producer } = memux_1.default({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        output: config.OUTPUT_TOPIC
    });
    const transformed = consumer.source.flatMap(async (value) => {
        return transform(value);
    });
    transformed.subscribe(consumer.sink);
    transformed.subscribe(producer.sink);
    consumer.source.subscribe(duplex.sink);
    duplex.source.subscribe(consumer.sink);
    return {
        source: producer.source
    };
}
exports.Annotator = Annotator;
function Broker({ name, duplex }) {
    const config = Object.assign({}, Config.Base, Config.Broker);
    const { consumer, producer } = memux_1.default({
        name: name || config.NAME,
        url: config.KAFKA_ADDRESS,
        output: config.OUTPUT_TOPIC
    });
    return {
        source: producer.source
    };
}
exports.Broker = Broker;
