import {LocalStorageHelper} from './local-storage-helper';
import {Constants} from '../constants';

/**
 * SessionStorageHelper is used to store session data.
 *
 * @author Abhishek Taparia
 * @version 0.0.34
 */
export class SessionStorageHelper {

    private static SESSION_STORAGE = window.sessionStorage;
    private static readonly SESSION_STORAGE_KEY_PREFIX = Constants.COOEE.concat('/', this.getAppID(), '/');

    static getString(key: string, defaultValue: string): string {
        return this.getItem(key) || defaultValue;
    }

    static setString(key: string, value: string): void {
        this.setItem(key, value);
    }

    private static getItem(key: string): string | null {
        return this.SESSION_STORAGE.getItem(
            this.SESSION_STORAGE_KEY_PREFIX.concat(key),
        );
    }

    private static setItem(key: string, value: string): void {
        this.SESSION_STORAGE.setItem(
            this.SESSION_STORAGE_KEY_PREFIX.concat(key),
            value,
        );
    }

    private static getAppID(): string {
        return LocalStorageHelper.getString(Constants.STORAGE_APP_ID);
    }

}
