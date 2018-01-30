"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Quad.toNQuads = (quads) => {
        return quads.map(quad => {
            const { subject, predicate, object, label } = quad;
            return `${subject} ${predicate} ${Helpers.isIRI(object) ? object : JSON.stringify(object)} ${label ? label : ''} .\n`;
        }).join('');
    };
})(Quad = exports.Quad || (exports.Quad = {}));
exports.default = Quad;
