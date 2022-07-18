/**
 * Constants used across the SDK.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class Constants {

    static API_URL: string = 'https://api.sdk.letscooee.com';
    static readonly SDK_VERSION: string = require('../package.json').version;
    static SDK_VERSION_CODE: number;
    static SDK_DEBUG: boolean = false;

    static SDK: string = 'WEB';
    static LOG_PREFIX: string = 'CooeeSDK';

    static CANVAS_WIDTH = 1080;
    static CANVAS_HEIGHT = 1920;

    // region Local Storage Keys
    // Do not change the local storage id as this is also being used in Shopify
    static STORAGE_APP_ID: string = 'cooaid';
    static STORAGE_USER_ID: string = 'uid';
    static STORAGE_SDK_TOKEN: string = 'st';
    static STORAGE_DEVICE_UUID: string = 'uuid';
    static STORAGE_SESSION_ID: string = 'sid';
    static STORAGE_SESSION_NUMBER: string = 'sn';
    static STORAGE_SESSION_START_TIME: string = 'sst';
    static STORAGE_SESSION_START_EVENT_SENT: string = 'sses';
    static STORAGE_FIRST_TIME_LAUNCH: string = 'ifl';
    static STORAGE_LAST_ACTIVE: string = 'la';
    static STORAGE_TRIGGER_START_TIME: string = 'tst';
    static STORAGE_ACTIVE_TRIGGER: string = 'at';
    static STORAGE_ACTIVE_TRIGGERS: string = 'ats';
    static STORAGE_SHOPIFY_PAST_ORDERS_DATA_SENT: string = 'spods';
    // endregion

    static IDLE_TIME_IN_SECONDS: number = 30 * 60;

    static IN_APP_CONTAINER_NAME: string = 'cooee-wrapper';

    static {
        const rawCode = Constants.SDK_VERSION.split('.').map((item) => item.padStart(2, '0')).join('');
        Constants.SDK_VERSION_CODE = parseInt(rawCode, 10);
    }

}
