import Logger from 'js-logger';
import {Constants} from '../constants';

/**
 * Utility class for printing different log messages.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class Log {

    /**
     * Log info messages.
     *
     * @param {any} messages
     */
    static log(...messages: any): void {
        Logger.info(...messages);
    }

    /**
     * Log error messages.
     *
     * @param {any} messages
     */
    static error(...messages: any): void {
        Logger.error(...messages);
    }

    /**
     * Log warning messages.
     *
     * @param {any} messages
     */
    static warn(...messages: any): void {
        Logger.warn(...messages);
    }

    static configure(): void {
        Logger.useDefaults({
            formatter: function (messages) {
                messages.unshift(`${Constants.LOG_PREFIX} (v${Constants.SDK_VERSION}):`);
            },
        });

        if (localStorage.cooeeLogLevel) {
            // @ts-ignore
            Logger.setLevel(Logger[localStorage.cooeeLogLevel]);
        } else {
            Logger.setLevel(Logger.OFF);
        }
    }

}
