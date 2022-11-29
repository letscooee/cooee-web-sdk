/**
 * SessionStorageHelper is used to store session data.
 *
 * @author Abhishek Taparia
 * @version 0.0.34
 */
import {LocalStorageHelper} from './local-storage-helper';
import {Constants} from '../constants';

export class SessionStorageHelper {

    private static SESSION_STORAGE = window.sessionStorage;
    private static readonly CURRENT_APP_ID = LocalStorageHelper.getString(Constants.STORAGE_APP_ID);

    static getString(key: string, defaultValue: string): string {
        return this.getItem(key) || defaultValue;
    }

    static setString(key: string, value: string): void {
        this.setItem(key, value);
    }

    private static getItem(key: string): string | null {
        try {
            return JSON.parse(this.SESSION_STORAGE.getItem(this.CURRENT_APP_ID)!)[key];
        } catch (error) {
            return null;
        }
    }

    private static setItem(key: string, value: string): void {
        let currentAppValue;
        try {
            currentAppValue = JSON.parse(this.SESSION_STORAGE.getItem(this.CURRENT_APP_ID)!);
        } catch (ignored) {
        }

        if (currentAppValue) {
            currentAppValue[key] = value;
        } else {
            currentAppValue = {
                [key]: value,
            };
        }

        this.SESSION_STORAGE.setItem(this.CURRENT_APP_ID, JSON.stringify(currentAppValue));
    }

}
