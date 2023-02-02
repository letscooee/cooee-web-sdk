import {Configurations} from '../app/configurations';

/**
 * Interface to store the response of UserAuthRequest.
 */
export interface DeviceAuthResponse extends Configurations {

    userID: string; // user-id from server
    sdkToken: string; // sdk-token from server
    deviceID?: string; // device-id from server

}
