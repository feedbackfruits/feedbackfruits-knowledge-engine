import Quad from './quad';
import Doc from './doc';
export declare function iriify(str: string): string;
export declare function encodeIRI(str: string): string;
export declare function isIRI(str: string): boolean;
export declare function decodeIRI(str: string): string;
export declare const quadsToDocs: (quads: Quad[]) => Doc[];
export declare const docToQuads: (doc: Doc) => Promise<Quad[]>;
export declare const quadsToNQuads: (quads: Quad[]) => string[];