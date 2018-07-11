"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseSRT = require("parse-srt");
function parse(url, text) {
    let parsed;
    try {
        parsed = parseSRT(text);
    }
    catch (e) {
        console.log('Failed SRT parsing:', url);
        throw e;
    }
    const captions = parsed.map((sub, index) => {
        const { id, start, end, text } = sub;
        const duration = end - start;
        const parsedText = text.replace(/<br \/>/, ' ');
        return {
            "@id": `${url}#${index}`,
            "@type": "VideoCaption",
            startsAfter: `PT${start}S`,
            duration: `PT${duration}S`,
            text: parsedText,
            language: "en"
        };
    });
    return captions;
}
exports.parse = parse;
