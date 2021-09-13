import {TriggerData} from '../trigger/trigger-data';

/**
 * This is a model class to store event response from server.
 */
export class EventResponse {

    triggerData: TriggerData | undefined;
    eventID: string | undefined;
    sessionID: string | undefined;

}
