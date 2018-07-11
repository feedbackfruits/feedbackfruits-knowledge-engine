import { Operation } from 'memux';
import * as Config from './config';
import { Doc } from './doc';
export declare type BrokerOptions = {
    name: string;
    receive: (operation: Operation<Doc>) => Promise<void>;
    customConfig?: typeof Config.Base;
};
export declare function Broker({ name, receive, customConfig }: BrokerOptions): Promise<void>;
