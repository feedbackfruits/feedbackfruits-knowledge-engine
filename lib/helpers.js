"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doc_1 = require("./doc");
const isuri = require("isuri");
const Context = require("feedbackfruits-knowledge-context");
function iriify(str) {
    return `<${str}>`;
}
exports.iriify = iriify;
function encodeRDF(str) {
    if (isURI(str))
        return iriify(str);
    if (isLiteral(str))
        return encodeLiteral(str);
    return str.replace(/\n/g, "\\n");
}
exports.encodeRDF = encodeRDF;
function isLiteral(str) {
    return /\^\^/.test(str);
}
exports.isLiteral = isLiteral;
function encodeLiteral(str) {
    const [value, type] = str.split("^^");
    return `${value}^^${iriify(type)}`;
}
exports.encodeLiteral = encodeLiteral;
function isURI(str) {
    return isuri.isValid(str);
}
exports.isURI = isURI;
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
async function getDoc(config, subject) {
    const { CAYLEY_ADDRESS } = config;
    console.log('Getting quads for:', subject);
    const query = `
  var subject = ${JSON.stringify(encodeRDF(subject))};
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
    return doc_1.default.fromQuads(quads, Context.context);
}
exports.getDoc = getDoc;
