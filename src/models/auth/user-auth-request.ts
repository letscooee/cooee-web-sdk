import {Device} from '../device/device';

/**
 * This class is used in sending request body for the first time to get sdkToken from server
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class UserAuthRequest {

    /**
     * Public constructor
     *
     * @param {string} appID provided to the client.
     * @param {string} appSecret provided to the client.
     * @param {Device} deviceData basic property of the device.
     */
    constructor(
        readonly appID: string,
        readonly appSecret: string,
        readonly deviceData: Device,
    ) {
    }

}
