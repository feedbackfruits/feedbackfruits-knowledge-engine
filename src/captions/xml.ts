import * as xml2js from 'xml2js';
import { trimNewlines, unescapeHtml, Caption } from './index';

export type CaptionResponse = {
  transcript: {
    text: Array<{ $: { start: string, dur: string }, _?: string }>
  }
};

export async function parse(captionsURL: string, captionsString: string): Promise<Array<Caption>>  {
  const json: CaptionResponse = await new Promise<any>((resolve, reject) => {
    xml2js.parseString(captionsString, { trim: false }, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });

  let startIndex = 0;
  const captions = json.transcript.text;
  return captions.map((caption, index) => {
    const text = '_' in caption ? trimNewlines(unescapeHtml(caption['_'])) : '';
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

    // Add 1 for the spaces in between the captions, except on the last caption
    startIndex = startIndex + text.length + (index === captions.length - 1 ? 0 : 1 );

    return { ...partialCaption, "@id": id, "@type": "VideoCaption" };
  });
}
