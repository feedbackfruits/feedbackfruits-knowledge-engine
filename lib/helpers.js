"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quad_1 = require("./quad");
const doc_1 = require("./doc");
const jsonld_1 = require("jsonld");
const isuri = require("isuri");
const memux = require("memux");
const Context = require("feedbackfruits-knowledge-context");
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
        const compactedDoc = await doc_1.default.compact(data, { "@context": [] });
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
async function getDoc(config, subject) {
    const { CAYLEY_ADDRESS } = config;
    console.log('Getting quads for:', subject);
    const query = `
  var subject = ${JSON.stringify(encodeIRI(subject))};
  g.V(subject)
  	.OutPredicates()
  	.ForEach(function mapPredicates(node) {
        var predicate = node.id;
        return g.V(subject)
          .Out(predicate)
          .ForEach(function emitObject(node) {
            var object = node.id;
            g.Emit({
              subject: subject,
              predicate: predicate,
              object: object
            });
          });
      })`;
    const url = `${CAYLEY_ADDRESS}/api/v1/query/gizmo`;
    const response = await fetch(url, {
        method: 'post',
        body: query
    });
    const { result: quads = [] } = await response.json();
    return exports.quadsToDocs(quads, Context.context);
}
exports.getDoc = getDoc;
exports.quadsToDocs = async (quads, context) => {
    const nquads = quad_1.default.toNQuads(quads);
    const doc = await jsonld_1.promises.fromRDF(nquads);
    return doc_1.default.expand(doc, context);
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
