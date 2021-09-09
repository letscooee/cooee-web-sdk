/**
 * Constants used across the SDK.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class Constants {

    static API_URL: string = 'http://127.0.0.1:3003';
    static SDK: string = 'WEB';
    static LOG_PREFIX: string = 'CooeeSDK';

    // region Local Storage Keys
    static STORAGE_USER_ID: string = 'uid';
    static STORAGE_SDK_TOKEN: string = 'st';
    static STORAGE_DEVICE_UUID: string = 'uuid';
    static STORAGE_SESSION_ID: string = 'sid';
    static STORAGE_SESSION_NUMBER: string = 'sn';
    static STORAGE_SESSION_START_TIME: string = 'sst';
    static STORAGE_SESSION_START_EVENT_SENT: string = 'sses';
    static STORAGE_FIRST_TIME_LAUNCH: string = 'ifl';
    static STORAGE_LAST_ACTIVE: string = 'la';
    // endregion

    static IDLE_TIME_IN_SECONDS: number = 30 * 60;

}
