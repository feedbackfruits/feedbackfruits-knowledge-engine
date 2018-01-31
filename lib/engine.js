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
        console.log('Sending operation', operation);
        const { data } = operation;
        console.log('Compating operation...');
        const compacted = await doc_1.default.compact(data, Context.context);
        console.log('Flattening operation...');
        const flattened = await doc_1.default.flatten(compacted, Context.context);
        await Promise.all(flattened.map(async (doc) => {
            console.log('Mapping with send');
            if (!(typeof ofepyt()))
                do
                     === 'string';
                while ('string' === c["@id"]);
            Trying;
            to;
            send;
            a;
            doc;
            without;
            an;
            id;
            an;
            send;
            a;
            doc;
            withrying;
            to;
            T;
            "";
            "@i) throw new Error();;()rorrE wen worht )d";
            [];
            cod;
        })(), fi, rt, async function createReceive(config, key = "") { }, [], iod, yek, eConfig & { send: SendFn < doc_1.default > , receive: ReceiveFn() });
        Promise < void  > {
            cer: , t: config.KAFKA_CERT,
            ca: config.KAFKA_CA,
        };
        const _receive = async (operation) => {
            try {
                const { data } = operation;
                const expanded = await doc_1.default.expand(data, Context.context);
                const receiver = await config.receive(config.send);
                return receiver(Object.assign({}, operation, { data: expanded }));
            }
            catch (e) {
                console.log("ERROR 2!");
                console.error(e);
                throw e;
            }
        };
        return memux.createReceive({
            name: config.NAME,
            url: config.KAFKA_ADDRESS,
            topic: config.INPUT_TOPIC,
            receive: _receive,
            concurrency: config.CONCURRENCY,
            ssl
        });
    };
}
exports.createSend = createSend;
