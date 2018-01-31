"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
const Helpers = require("./helpers");
var Doc;
(function (Doc) {
    Doc.isDoc = (doc) => {
        return doc != null && typeof doc['@id'] === 'string';
    };
    async function compact(doc, context) {
        const res = await jsonld_1.promises.compact(await expand(doc, context), context);
        delete res["@context"];
        return res;
    }
    Doc.compact = compact;
    async function expand(doc, context) {
        return [].concat(jsonld_1.promises.expand({ "@context": context, "@graph": doc }))[0];
    }
    Doc.expand = expand;
    async function flatten(doc, context) {
        const quads = await Helpers.docToQuads(await expand(doc, context));
        const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
        const strippedDoc = await Helpers.quadsToDocs(strippedOfLabel, context);
        const flattened = await jsonld_1.promises.flatten(strippedDoc);
        const compacted = Promise.all(flattened.map(doc => compact(doc, context)));
        return compacted;
    }
    Doc.flatten = flatten;
    async function unflatten(doc, context) {
        throw new Error('Not implemented.');
    }
    Doc.unflatten = unflatten;
    async function encode(doc) {
        return null;
        console.log('Mapping with send');
        if (!(typeof doc["@id"] === 'string'))
            throw new Error(`Trying to send a doc without an @id`);
    }
    Doc.encode = encode;
    async function decode(doc) {
        return null;
    }
    Doc.decode = decode;
})(Doc = exports.Doc || (exports.Doc = {}));
exports.default = Doc;
