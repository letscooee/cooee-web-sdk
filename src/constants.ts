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
    static UUID: string = 'uuid';

    static STORAGE_SDK_TOKEN: string = 'sdk_token';
    static STORAGE_USER_ID: string = 'user_id';
    static STORAGE_SESSION_NUMBER: string = 'session_number';
    static STORAGE_FIRST_TIME_LAUNCH: string = 'is_first_launch';
    static STORAGE_SESSION_START_TIME: string = 'session_start_time';
    static STORAGE_SESSION_ID: string = 'session_id';
    static STORAGE_LAST_TOKEN_ATTEMPT: string = 'last_token_check_attempt';

    static IDLE_TIME_IN_SECONDS: number = 30 * 60;

}
