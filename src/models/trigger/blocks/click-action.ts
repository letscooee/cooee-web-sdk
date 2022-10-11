export interface ClickAction {

    readonly at?: ClickActionType;
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

export enum ClickActionType {

    IAB = 1,
    EXTERNAL = 2,
    PROMPT = 3,
    SAME_TAB = 4,
    SHARE = 5,

    KEY_VALUE = 100,
    KV_VIEW_ITEM = 101,
    KV_ADD_TO_CART = 102,
    KV_COUPON_CODE = 103,
    KV_VIEW_CATEGORY = 104,

}
