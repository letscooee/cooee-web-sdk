/**
 * Interface to store the response of UserAuthRequest.
 */
export interface DeviceAuthResponse {

    userID: string; // user-id from server
    sdkToken: string; // sdk-token from server
    deviceID: string; // device-id from server

}
