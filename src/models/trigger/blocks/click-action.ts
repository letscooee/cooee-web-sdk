import {Props} from '../../../types';

export interface ClickAction {

    readonly iab?: Props;
    readonly ext?: Props;

    /**
     * Goto URL- Opens url in same tab
     */
    readonly gu?: Props;
    readonly pmpt?: Permission;
    readonly up?: Props;
    readonly kv?: Props;
    readonly custKV?: Props;
    readonly share?: Props;
    readonly close: boolean;

}

export enum Permission {
    // eslint-disable-next-line no-unused-vars
    CAMERA = 1,
    // eslint-disable-next-line no-unused-vars
    LOCATION = 2,
    // eslint-disable-next-line no-unused-vars
    PUSH = 3,
}
