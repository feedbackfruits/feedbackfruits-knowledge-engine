"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld = require("jsonld");
const isuri = require("isuri");
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
exports.quadsToDocs = (quads) => {
    return Object.values(quads.reduce((memo, quad) => {
        const { subject, predicate, object } = quad;
        return Object.assign({}, memo, { [decodeIRI(subject)]: Object.assign({}, (memo[decodeIRI(subject)] || { '@id': decodeIRI(subject) }), { [decodeIRI(predicate)]: [
                    ...((memo[decodeIRI(subject)] && memo[decodeIRI(subject)][decodeIRI(predicate)]) || []),
                    object
                ] }) });
    }, {}));
};
exports.docToQuads = async (doc) => {
    return new Promise((resolve, reject) => {
        jsonld.toRDF(doc, { format: 'application/nquads' }, function (err, nquads) {
            if (err != null)
                return reject(err);
            const lines = nquads.split('\n');
            lines.pop();
            const quads = lines.map(line => {
                const [subject, predicate, object] = line.split(/ (?=["<\.])/);
                return { subject, predicate, object: JSON.parse(object) };
            });
            return resolve(quads);
        });
    });
};
exports.quadsToNQuads = (quads) => {
    return quads.map(quad => {
        const { subject, predicate, object, label } = quad;
        return `${subject} ${predicate} ${JSON.stringify(object)} ${label || '.'}`;
    });
};
