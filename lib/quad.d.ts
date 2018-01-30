export declare type NQuads = string;
export declare type Quad = {
    subject: string;
    predicate: string;
    object: string;
    label?: string;
};
export declare module Quad {
    const isQuad: (quad: object) => quad is Quad;
    const toNQuads: (quads: Quad[]) => string;
}
export default Quad;
