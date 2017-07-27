import { Actionable, Progressable, Readable, Duplex } from 'memux';
export declare type Miner = Readable<Actionable & Progressable>;
export declare type MinerOptions = {
    name: string;
    readable: Readable<Actionable>;
};
export declare function Miner({name, readable}: MinerOptions): Miner;
export declare type Annotator = Readable<Actionable & Progressable>;
export declare type AnnotatorOptions = {
    name: string;
    transform: <T extends Actionable>(value: T) => T;
    duplex: Duplex<Actionable & Progressable, Actionable & Progressable>;
};
export declare function Annotator({name, transform, duplex}: AnnotatorOptions): Annotator;
export declare type Broker = Readable<Actionable & Progressable>;
export declare type BrokerOptions = {
    name: string;
    duplex: Duplex<Actionable, Actionable>;
};
export declare function Broker({name, duplex}: {
    name: any;
    duplex: any;
}): Broker;
