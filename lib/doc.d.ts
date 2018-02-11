import * as _Context from 'feedbackfruits-knowledge-context';
import Quad from './quad';
export declare type Doc = object;
export declare type Context = typeof _Context.context;
export declare type Frame = {
    "@context": Context;
} & object;
export declare module Doc {
    function isDoc(doc: object): doc is Doc;
    function _keys(doc: Doc): Object;
    function keys(doc: Doc): string[];
    function validate(doc: Doc, context: Context): Promise<boolean>;
    function isValid(doc: Doc, context: Context): Promise<boolean>;
    function compare(a: Doc, b: Doc, context: Context): Promise<number>;
    function compact(doc: Doc, context: Context): Promise<Doc>;
    function expand(doc: Doc, context: Context): Promise<Doc>;
    function flatten(doc: Doc, context: Context): Promise<Doc[]>;
    function frame(graph: Doc[], frame: Frame): Promise<any>;
    function fromQuads(quads: Array<Quad>, context: any): Promise<Doc>;
    function toQuads(doc: Doc): Promise<Quad[]>;
}
export default Doc;
