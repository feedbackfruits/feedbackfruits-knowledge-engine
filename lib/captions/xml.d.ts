import { Caption } from './index';
export declare type CaptionResponse = {
    transcript: {
        text: Array<{
            $: {
                start: string;
                dur: string;
            };
            _?: string;
        }>;
    };
};
export declare function parse(captionsURL: string, captionsString: string): Promise<Array<Caption>>;
