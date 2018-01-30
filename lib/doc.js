"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
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
        return jsonld_1.promises.expand({ "@context": context, "@graph": doc });
    }
    Doc.expand = expand;
    async function flatten(doc, context) {
        return [].concat(jsonld_1.promises.flatten({ "@context": context, "@graph": doc }));
    }
    Doc.flatten = flatten;
    async function unflatten(doc, context) {
        throw new Error('Not implemented.');
    }
    Doc.unflatten = unflatten;
})(Doc = exports.Doc || (exports.Doc = {}));
exports.default = Doc;
