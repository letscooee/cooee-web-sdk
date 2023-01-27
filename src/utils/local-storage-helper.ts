/**
 * LocalStorageHelper is used to store local shared preference data
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class LocalStorageHelper {

    static LOCAL_STORAGE = window.localStorage;

    /**
     * Get value from local storage as string data type.
     *
     * @param {string} key key provided for the stored value.
     * @param {string} defaultValue default value if key not present
     * @return {string} value stored .
     */
    static getString(key: string, defaultValue: string = ''): string {
        return LocalStorageHelper.LOCAL_STORAGE.getItem(key) || defaultValue;
    }

    /**
     * Set value in local storage as string data type.
     * @param {string} key key provided for the storing value.
     * @param {string} value value stored.
     */
    static setString(key: string, value: string): void {
        if (!value) value = '';
        LocalStorageHelper.LOCAL_STORAGE.setItem(key, value);
    }

    /**
     * Get value from local storage as string data type.
     *
     * @param {string} key key provided for the stored value.
     * @param {number} defaultValue default value if key not present.
     * @return {number} value stored.
     */
    static getNumber(key: string, defaultValue: number): number {
        return +LocalStorageHelper.getString(key, '') || defaultValue;
    }

    /**
     * Set value in local storage as string data type.
     * @param {string} key key provided for the storing value.
     * @param {number} value value stored.
     */
    static setNumber(key: string, value: number): void {
        LocalStorageHelper.setString(key, value.toString());
    }

    /**
     * Get value from local storage as string data type.
     *
     * @param {string} key key provided for the stored value.
     * @param {boolean} defaultValue default value if key not present
     * @return {boolean} value stored.
     */
    static getBoolean(key: string, defaultValue: boolean): boolean {
        const item = this.LOCAL_STORAGE.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return defaultValue;
    }

    /**
     * Set value in local storage as string data type.
     * @param {string} key key provided for the storing value.
     * @param {boolean} value value stored.
     */
    static setBoolean(key: string, value: boolean): void {
        LocalStorageHelper.setString(key, JSON.stringify(value));
    }

    /**
     * Get key-value data from local storage for the given key.
     *
     * @param {string} key key provided for the stored value.
     * @return {any} value stored.
     */
    static getObject<T = Record<string, any>>(key: string): T {
        try {
            return JSON.parse(LocalStorageHelper.getString(key, ''));
        } catch (ignored) {
            return {} as T;
        }
    }

    /**
     * Get an array value from local storage for the given key.
     *
     * @param {string} key key provided for the stored value.
     * @param defaultValue The default value to return.
     * @return {any} value stored.
     */
    static getArray<T>(key: string, defaultValue: T[] = []): T[] {
        try {
            return JSON.parse(LocalStorageHelper.getString(key, '')) || defaultValue;
        } catch (ignored) {
            return defaultValue;
        }
    }

    /**
     * Set a key-value object in local storage.
     * @param {string} key key provided for the storing value.
     * @param {any} value value stored.
     */
    static setObject(key: string, value: Record<string, any>): void {
        LocalStorageHelper.setString(key, JSON.stringify(value));
    }

    /**
     * Set a key-value object in local storage.
     * @param {string} key key provided for the storing value.
     * @param {any} value value stored.
     */
    static setArray(key: string, value: any[]): void {
        LocalStorageHelper.setString(key, JSON.stringify(value));
    }

    /**
     * Remove the specified key from storage.
     *
     * @param {string} key to be removed.
     */
    static remove(key: string): void {
        LocalStorageHelper.LOCAL_STORAGE.removeItem(key);
    }

}
