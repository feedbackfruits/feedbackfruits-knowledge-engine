import Doc from './doc';
export declare function iriify(str: string): string;
export declare function encodeIRI(str: string): string;
export declare function isURI(str: string): boolean;
export declare function isIRI(str: string): boolean;
export declare function decodeIRI(str: string): string;
export declare function getDoc(config: any, subject: any): Promise<Doc>;
