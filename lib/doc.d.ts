import * as _Context from 'feedbackfruits-knowledge-context';
export declare type Doc = object;
export declare type Context = typeof _Context.context;
export declare module Doc {
    function isDoc(doc: object): doc is Doc;
    function _keys(doc: Doc): Object;
    function keys(doc: Doc): string[];
    function validate(doc: Doc, context: Context): Promise<boolean>;
    function isValid(doc: Doc, context: Context): Promise<boolean>;
    function compact(doc: Doc, context: Context): Promise<Doc>;
    function expand(doc: Doc, context: Context): Promise<Doc>;
    function flatten(doc: Doc, context: Context): Promise<Doc[]>;
    function unflatten(doc: Doc, context: Context): Promise<Doc>;
    function encode(doc: Doc): Promise<Doc>;
    function decode(doc: Doc): Promise<Doc>;
}
export default Doc;
