import fetch from 'node-fetch';
import * as iso8601 from 'duration-iso-8601';

import * as SRT from './srt';
import * as XML from './xml';

export const googleRegex = /https:\/\/video\.google\.com\/timedtext/;
export function isYoutubeCaptionURL(url) {
  return googleRegex.test(url);
}

export type Caption = {
  "@id": string,
  "@type": string | string[],
  relativeStartPosition: number,
  text: string,
  language: string,
  startsAfter: string,
  duration: string,
};

export type CaptionMetadata = {
  totalLength: number,
  totalDuration: string
}

export function unescapeHtml(safe) {
  return safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function trimNewlines(str: string) {
  return str.replace('\n', ' ').trim();
}

export async function getCaptions(url: string): Promise<Caption[]> {
  const response = await fetch(url);
  const text = await response.text();
  if (isYoutubeCaptionURL(url)) return XML.parse(url, text);
  return SRT.parse(url, text);
}

export function toText(captions: Caption[]): string {
  return captions.map(c => c.text).join('\n');
}

export function toMetadata(captions: Caption[]) {
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

export {
  SRT,
  XML,
}
