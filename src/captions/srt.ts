import parseSRT = require('parse-srt');
import { trimNewlines, unescapeHtml, Caption } from './index';

export function parse(url: string, text: string): Caption[] {
  // SRT captions
  let parsed;
  try {
    parsed = parseSRT(text);
  } catch(e) {
    console.log('Failed SRT parsing:', url);
    throw e;
  }

  const captions = parsed.map((sub, index) => {
    const { id, start, end, text } = sub;
    const duration = end - start;
    const parsedText = text.replace(/<br \/>/, ' ');
    // console.log('Sub:', id, start, end, text);
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
