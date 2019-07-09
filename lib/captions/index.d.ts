import * as SRT from './srt';
import * as XML from './xml';
export declare const googleRegex: RegExp;
export declare function isYoutubeCaptionURL(url: any): boolean;
export declare type Caption = {
    "@id": string;
    "@type": string | string[];
    relativeStartPosition: number;
    text: string;
    language: string;
    startsAfter: string;
    duration: string;
};
export declare type CaptionMetadata = {
    totalLength: number;
    totalDuration: string;
};
export declare function unescapeHtml(safe: any): any;
export declare function trimNewlines(str: string): string;
export declare function getCaptions(url: string): Promise<Caption[]>;
export declare function toText(captions: Caption[]): string;
export declare function toMetadata(captions: Caption[]): {
    totalLength: number;
    totalDuration: string;
};
export { SRT, XML, };
