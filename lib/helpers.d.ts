import Doc from './doc';
export declare function iriify(str: string): string;
export declare function encodeRDF(str: string): string;
export declare function isLiteral(str: string): boolean;
export declare function encodeLiteral(str: any): string;
export declare function isURI(str: string): any;
export declare function isIRI(str: string): boolean;
export declare function decodeIRI(str: string): string;
export declare function getDoc(config: any, subject: any): Promise<Doc>;
