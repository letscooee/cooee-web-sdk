export interface ClickAction {

    readonly iab?: Record<string, any>;
    readonly ext?: Record<string, any>;

    /**
     * Goto URL- Opens url in same tab
     */
    readonly gu?: Record<string, any>;
    readonly pmpt?: Permission;
    readonly up?: Record<string, any>;
    readonly kv?: Record<string, any>;
    readonly custKV?: Record<string, any>;
    readonly share?: Record<string, any>;
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
