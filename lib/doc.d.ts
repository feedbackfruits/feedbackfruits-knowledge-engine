import * as _Context from 'feedbackfruits-knowledge-context';
export declare type Doc = object;
export declare type Context = typeof _Context.context;
export declare module Doc {
    const isDoc: (doc: object) => doc is object;
    function compact(doc: Doc, context: Context): Promise<Doc>;
    function expand(doc: Doc, context: Context): Promise<Doc>;
    function flatten(doc: Doc, context: Context): Promise<Doc[]>;
    function unflatten(doc: Doc, context: Context): Promise<Doc>;
    function encode(doc: Doc): Promise<Doc>;
    function decode(doc: Doc): Promise<Doc>;
}
export default Doc;
