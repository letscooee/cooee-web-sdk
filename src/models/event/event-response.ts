import {TriggerData} from '../trigger/trigger-data';

/**
 * This is an interface to store event response from server.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export interface EventResponse {

    triggerData: TriggerData | undefined;
    eventID: string | undefined;
    sessionID: string | undefined;

}
