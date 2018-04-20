"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
const Helpers = require("./helpers");
const quad_1 = require("./quad");
var Doc;
(function (Doc) {
    function isDoc(doc) {
        return doc != null && typeof doc['@id'] === 'string';
    }
    Doc.isDoc = isDoc;
    ;
    function _keys(doc) {
        if (doc instanceof Array)
            return doc.reduce((memo, d) => {
                return Object.assign({}, memo, _keys(d));
            }, {});
        if (typeof doc === 'object')
            return Object.keys(doc).reduce((memo, key) => {
                if (key[0] !== "@")
                    memo[key] = true;
                const value = doc[key];
                return Object.assign({}, memo, _keys(value));
            }, {});
        return {};
    }
    Doc._keys = _keys;
    function keys(doc) {
        return Object.keys(_keys(doc));
    }
    Doc.keys = keys;
    async function validate(doc, context) {
        const flattened = await flatten(doc, context);
        const docKeys = keys(flattened);
        const isValid = docKeys.reduce((memo, key) => {
            if (Helpers.isURI(key))
                throw new Error(`Doc contains invalid key "${key}".`);
            return memo;
        }, true);
        return isValid;
    }
    Doc.validate = validate;
    async function isValid(doc, context) {
        try {
            return validate(doc, context);
        }
        catch (e) {
            return false;
        }
    }
    Doc.isValid = isValid;
    async function compare(a, b, context = { "@context": [] }) {
        const expandedA = await expand(a, context);
        const expandedB = await expand(b, context);
        const quadsA = await toQuads(expandedA);
        const quadsB = await toQuads(expandedB);
        const sortedQuadsA = quadsA.sort(quad_1.default.compare);
        const sortedQuadsB = quadsB.sort(quad_1.default.compare);
        const nquadsA = quad_1.default.toNQuads(sortedQuadsA);
        const nquadsB = quad_1.default.toNQuads(sortedQuadsB);
        return nquadsA.localeCompare(nquadsB);
    }
    Doc.compare = compare;
    async function compact(doc, context) {
        const res = await jsonld_1.promises.compact(await expand(doc, context), context);
        delete res["@context"];
        return res;
    }
    Doc.compact = compact;
    async function expand(doc, context) {
        return [].concat(await jsonld_1.promises.expand({ "@context": context, "@graph": doc }));
    }
    Doc.expand = expand;
    async function flatten(doc, context) {
        const expanded = await expand(await compact(doc, context), context);
        const quads = await toQuads(expanded);
        const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
        const strippedDoc = await fromQuads(strippedOfLabel, context);
        const flattened = await jsonld_1.promises.flatten(strippedDoc);
        const compacted = Promise.all(flattened.map(doc => compact(doc, context)));
        return compacted;
    }
    Doc.flatten = flatten;
    async function frame(graph, frame) {
        const flattened = await flatten({ "@graph": graph }, frame["@context"]);
        const expanded = await expand(flattened, frame["@context"]);
        const framed = await jsonld_1.promises.frame(expanded, frame);
        return [].concat(framed["@graph"]);
    }
    Doc.frame = frame;
    async function fullfilsFrame(graph, _frame) {
        const framed = await frame(graph, _frame);
        if (framed.length === 0)
            return false;
        const reframed = await frame(framed, _frame);
        const compared = await compare(framed, reframed, _frame["@context"]);
        return compared === 0;
    }
    Doc.fullfilsFrame = fullfilsFrame;
    async function fromQuads(quads, context) {
        const nquads = quad_1.default.toNQuads(quads);
        const doc = await jsonld_1.promises.fromRDF(nquads, { useNativeTypes: true });
        return Doc.expand(doc, context);
    }
    Doc.fromQuads = fromQuads;
    ;
    async function toQuads(doc) {
        const nquads = await jsonld_1.promises.toRDF(doc, { format: 'application/nquads' });
        return quad_1.default.fromNQuads(nquads).reverse();
    }
    Doc.toQuads = toQuads;
    ;
})(Doc = exports.Doc || (exports.Doc = {}));
exports.default = Doc;
