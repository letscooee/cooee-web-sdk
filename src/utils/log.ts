import Logger from 'js-logger';

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
    static warning(...messages: any): void {
        Logger.warn(...messages);
    }

}
