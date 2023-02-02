import {AppConfiguration} from '../app/configuration';

/**
 * Interface to store the response of UserAuthRequest.
 */
export interface DeviceAuthResponse extends AppConfiguration {

    userID: string; // user-id from server
    sdkToken: string; // sdk-token from server
    deviceID?: string; // device-id from server

}
