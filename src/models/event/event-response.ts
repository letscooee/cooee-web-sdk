import {TriggerData} from '../trigger/trigger-data';
import {DeviceAuthResponse} from '../auth/device-auth-response';

/**
 * This is an interface to store event response from server.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export interface EventResponse extends DeviceAuthResponse {

    triggerData: TriggerData | undefined;
    eventID: string | undefined;
    sessionID: string | undefined;

}
