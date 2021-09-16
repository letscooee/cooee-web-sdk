import {Props} from '../../../types';

export interface ClickAction {

    readonly iab: Props;
    readonly external: Props;
    readonly prompts : string[];
    readonly up: Props;
    readonly kv: Props;
    readonly share: Props;
    readonly close: boolean;

}
