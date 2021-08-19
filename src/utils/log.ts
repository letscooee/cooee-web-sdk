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
     * @param {any[]} messages
     */
    static l(...messages: any[]) {
        console.log(Constants.LOG_PREFIX, ':', ...messages);
    }

    /**
     * Log error messages.
     *
     * @param {any[]} messages
     */
    static e(messages: any) {
        console.error(Constants.LOG_PREFIX, ':', ...messages);
    }

    /**
     * Log warning messages.
     *
     * @param {any[]} messages
     */
    static w(messages: any[]) {
        console.warn(Constants.LOG_PREFIX, ':', messages);
    }

}
