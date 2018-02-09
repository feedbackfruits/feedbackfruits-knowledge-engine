"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n3 = require("n3");
const Helpers = require("./helpers");
var Quad;
(function (Quad) {
    Quad.isQuad = (quad) => {
        return quad != null &&
            typeof quad === 'object' &&
            typeof quad['subject'] === 'string' &&
            typeof quad['predicate'] === 'string' &&
            typeof quad['object'] === 'string';
    };
    function fromNQuads(nquads) {
        const parser = n3.Parser();
        const quads = parser.parse(nquads, null).map(({ subject, predicate, object, graph }) => {
            return {
                subject,
                predicate,
                object,
                label: graph
            };
        });
        return quads;
    }
    Quad.fromNQuads = fromNQuads;
    Quad.toNQuads = (quads) => {
        return quads.map(quad => {
            const { subject, predicate, object, label } = quad;
            return `${Helpers.iriify(subject)} ${Helpers.iriify(predicate)} ${Helpers.encodeRDF(object)} ${label ? Helpers.iriify(label) : ''} .\n`;
        }).join('');
    };
})(Quad = exports.Quad || (exports.Quad = {}));
exports.default = Quad;
