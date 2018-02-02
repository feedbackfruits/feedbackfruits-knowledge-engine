"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
const Helpers = require("./helpers");
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
        const expanded = await expand(await compact(doc, context), context);
        const quads = await Helpers.docToQuads(expanded);
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
    }
    Doc.encode = encode;
    async function decode(doc) {
        return null;
    }
    Doc.decode = decode;
})(Doc = exports.Doc || (exports.Doc = {}));
exports.default = Doc;
