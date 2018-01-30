import { Operation } from 'memux';
import * as Engine from './engine';
import * as Config from './config';
import { Doc } from './doc';
export declare type AnnotatorOptions = {
    name: string;
    receive: (send: Engine.SendFn<Doc>) => (operation: Operation<Doc>) => Promise<void>;
    customConfig?: typeof Config.Base;
};
export declare function Annotator({name, receive, customConfig}: AnnotatorOptions): Promise<void>;
