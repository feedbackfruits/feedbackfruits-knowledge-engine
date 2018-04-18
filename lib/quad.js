"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers = require("./helpers");
const canonize = require("rdf-canonize");
var Quad;
(function (Quad) {
    function isQuad(quad) {
        return quad != null &&
            typeof quad === 'object' &&
            typeof quad['subject'] === 'string' &&
            typeof quad['predicate'] === 'string' &&
            typeof quad['object'] === 'string';
    }
    Quad.isQuad = isQuad;
    function compare(a, b) {
        const compareSubjects = a.subject.localeCompare(b.subject);
        const comparePredicates = a.predicate.localeCompare(b.predicate);
        const compareObjects = a.object.localeCompare(b.object);
        const compareLabels = a.label.localeCompare(b.label);
        return (compareSubjects !== 0 ? compareSubjects :
            comparePredicates !== 0 ? comparePredicates :
                compareObjects !== 0 ? compareObjects :
                    compareLabels !== 0 ? compareLabels :
                        0);
    }
    Quad.compare = compare;
    function fromNQuads(nquads) {
        const quads = canonize.NQuads.parse(nquads);
        return quads.map(({ subject, predicate, object, graph }) => {
            const objectValue = (object.datatype && object.datatype.value !== "http://www.w3.org/2001/XMLSchema#string") ?
                (JSON.stringify(object.value) + "^^" + Helpers.iriify(object.datatype.value)) :
                object.value;
            return {
                subject: subject.value,
                predicate: predicate.value,
                object: objectValue,
                label: graph.value
            };
        });
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
