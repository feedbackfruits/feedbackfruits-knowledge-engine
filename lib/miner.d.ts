import { Operation } from 'memux';
import * as Config from './config';
import { Doc } from './doc';
export declare type MinerOptions = {
    name: string;
    customConfig?: typeof Config.Base;
};
export declare function Miner({name, customConfig}: MinerOptions): Promise<(operation: Operation<Doc>) => Promise<void>>;
