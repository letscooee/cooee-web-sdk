import {Props} from '../../session/type';

/**
 * Class to store Device data.
 */
export class Device {

    /**
     * Public constructor
     *
     * @param {string} os
     * @param {string} cooeeSdkVersion
     * @param {string} appVersion
     * @param {string} osVersion
     * @param {string} sdk
     * @param {string} uuid
     * @param {Props} props
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
