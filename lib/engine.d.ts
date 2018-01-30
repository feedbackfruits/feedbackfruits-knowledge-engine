import * as memux from 'memux';
import * as Config from './config';
import Doc from './doc';
export declare type EngineConfig = typeof Config.Base;
export declare type SendFn<T> = {
    (operation: memux.Operation<T>): Promise<void>;
};
export declare type ReceiveFn<T> = {
    (send: SendFn<T>): (operation: memux.Operation<T>) => Promise<void>;
};
export declare function createSend(config: EngineConfig): Promise<SendFn<Doc>>;
export declare function createReceive(config: EngineConfig & {
    send: SendFn<Doc>;
    receive: ReceiveFn<Doc>;
}): Promise<void>;
