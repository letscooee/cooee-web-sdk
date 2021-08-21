import {Props} from '../../utils/type';

/**
 * Class to store Device data.
 */
export class Device {

    /**
     * Public constructor
     *
     * @param {string} os operating system
     * @param {string} cooeeSdkVersion cooee version integrated
     * @param {string} appVersion app version integrated
     * @param {string} osVersion operating system version
     * @param {string} sdk sdk here 'WEB'
     * @param {string} uuid device id generated/fetched
     * @param {Props} props device properties
     */
    constructor(
        readonly os: string,
        readonly cooeeSdkVersion: string,
        readonly appVersion: string,
        readonly osVersion: string,
        readonly sdk: string,
        public uuid: string,
        public props: Props,
    ) {
    }

}
