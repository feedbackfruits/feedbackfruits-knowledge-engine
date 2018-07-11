"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js = require("xml2js");
const index_1 = require("./index");
async function parse(captionsURL, captionsString) {
    const json = await new Promise((resolve, reject) => {
        xml2js.parseString(captionsString, { trim: false }, (err, result) => {
            if (err)
                return reject(err);
            return resolve(result);
        });
    });
    let startIndex = 0;
    const captions = json.transcript.text;
    return captions.map((caption, index) => {
        const text = '_' in caption ? index_1.trimNewlines(index_1.unescapeHtml(caption['_'])) : '';
        const partialCaption = {
            "@id": null,
            "@type": null,
            startsAfter: `PT${caption.$.start}S`,
            duration: `PT${caption.$.dur}S`,
            relativeStartPosition: startIndex,
            text,
            language: "en"
        };
        const id = `${captionsURL}#${index}`;
        startIndex = startIndex + text.length + (index === captions.length - 1 ? 0 : 1);
        return Object.assign({}, partialCaption, { "@id": id, "@type": "VideoCaption" });
    });
}
exports.parse = parse;
