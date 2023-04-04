/**
 * Utility class to alter Cookies.
 *
 * @author Abhishek Taparia
 */
export class CookieHelper {

    constructor() {
    }

    setCookie(key: string, value: string, expire: number, expireType = 'day') {
        let currentDate, expires;

        if (expireType === 'hour') expire = expire * 60 * 60 * 1000;
        else if (expireType === 'minute') expire = expire * 60 * 1000;
        else if (expireType === 'second') expire = expire * 1000;
        else expire = expire * 24 * 60 * 60 * 1000;

        currentDate = new Date();
        currentDate.setTime(currentDate.getTime() + expire);
        expires = 'expires=' + currentDate.toUTCString();
        document.cookie = key + '=' + value + ';' + expires + ';path=/';
        return value;
    }

    getCookie(key: string, defaultValue = {}): any {
        let name = key + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookieSplit = decodedCookie.split(';');

        for (let i = 0; i < cookieSplit.length; i++) {
            let cookie = cookieSplit[i].trim();
            if (cookie.indexOf(name) === 0) {
                const rawValue = cookie.substring(name.length, cookie.length);

                try {
                    return JSON.parse(rawValue) || defaultValue;
                } catch (e) {
                    return rawValue || defaultValue;
                }
            }
        }

        return defaultValue;
    }

    deleteCookie(key: string) {
        document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        return true;
    }

}
