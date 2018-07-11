"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const iso8601 = require("duration-iso-8601");
const SRT = require("./srt");
exports.SRT = SRT;
const XML = require("./xml");
exports.XML = XML;
exports.googleRegex = /https:\/\/video\.google\.com\/timedtext/;
function isYoutubeCaptionURL(url) {
    return exports.googleRegex.test(url);
}
exports.isYoutubeCaptionURL = isYoutubeCaptionURL;
function unescapeHtml(safe) {
    return safe
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
exports.unescapeHtml = unescapeHtml;
function trimNewlines(str) {
    return str.replace('\n', ' ').trim();
}
exports.trimNewlines = trimNewlines;
async function getCaptions(url) {
    const response = await node_fetch_1.default(url);
    const text = await response.text();
    if (isYoutubeCaptionURL(url))
        return XML.parse(url, text);
    return SRT.parse(url, text);
}
exports.getCaptions = getCaptions;
function toText(captions) {
    return captions.map(c => c.text).join('\n');
}
exports.toText = toText;
function toMetadata(captions) {
    const sorted = captions.sort((a, b) => iso8601.convertToSecond(a.startsAfter) - iso8601.convertToSecond(b.startsAfter));
    const lastCaption = sorted[sorted.length - 1];
    const lastCaptionStart = iso8601.convertToSecond(lastCaption.startsAfter);
    const lastCaptionDuration = iso8601.convertToSecond(lastCaption.duration);
    const totalDuration = `PT${lastCaptionStart + lastCaptionDuration}S`;
    const text = toText(sorted);
    const totalLength = text.length;
    return {
        totalLength,
        totalDuration
    };
}
exports.toMetadata = toMetadata;
