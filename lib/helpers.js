"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
const isuri = require("isuri");
const memux = require("memux");
function iriify(str) {
    return `<${str}>`;
}
exports.iriify = iriify;
function encodeIRI(str) {
    if (isuri.isValid(str))
        return iriify(str);
    return str;
}
exports.encodeIRI = encodeIRI;
function isIRI(str) {
    return /<(.*)>/.test(str);
}
exports.isIRI = isIRI;
function decodeIRI(str) {
    if (isIRI(str))
        return str.slice(1, str.length - 1);
    return str;
}
exports.decodeIRI = decodeIRI;
function createSend(config) {
    return async ({ action, key, data }) => {
        const sendFn = await memux.createSend(config);
        const compactedDoc = await compactDoc(data, {});
        return sendFn({ action, key, data: compactedDoc });
    };
}
exports.createSend = createSend;
function createReceive(config) {
    return async () => {
        const receiveFn = await memux.createReceive(config);
    };
}
exports.createReceive = createReceive;
async function compactDoc(ld, context) {
    const res = await jsonld_1.promises.compact(await expandDoc(ld, context), context);
    delete res["@context"];
    return res;
}
exports.compactDoc = compactDoc;
async function expandDoc(ld, context) {
    return jsonld_1.promises.expand({ "@context": context, "@graph": ld });
}
exports.expandDoc = expandDoc;
exports.quadsToDocs = async (quads, context) => {
    const nquads = exports.quadsToNQuads(quads);
    const doc = await jsonld_1.promises.fromRDF(nquads);
    return expandDoc(doc, context);
};
exports.docToQuads = async (doc) => {
    const nquads = await jsonld_1.promises.toRDF(doc, { format: 'application/nquads' });
    const lines = nquads.split('\n');
    lines.pop();
    const quads = lines.map(line => {
        const [subject, predicate, object, label] = line.split(/ (?=["<\.])/);
        const triple = { subject, predicate, object: (object[0] === "<" && object[object.length - 1] == ">") ? object : JSON.parse(object) };
        if (label !== '.')
            return Object.assign({}, triple, { label });
        return triple;
    });
    return quads.reverse();
};
exports.quadsToNQuads = (quads) => {
    return quads.map(quad => {
        const { subject, predicate, object, label } = quad;
        return `${subject} ${predicate} ${isIRI(object) ? object : JSON.stringify(object)} ${label ? label : ''} .\n`;
    }).join('');
};
