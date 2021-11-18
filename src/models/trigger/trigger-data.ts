import {Props} from '../../types';
import {InAppTrigger} from './inapp/in-app-trigger';

/**
 * This store the payload sent by server to render trigger.
 */
export class TriggerData {

    // TODO implement this on trigger implementation
    id: string;
    duration: number = 0;
    version: number;
    engagementID: string;
    internal: boolean;

    pn?: Props;
    ian?: InAppTrigger;

    /**
     * Public constructor
     *
     * @param {Props} data payload
     */
    constructor(data: Props) {
        this.id = data.id;
        this.duration = data.duration;
        this.version = data.version;
        this.engagementID = data.engagementID;
        this.internal = data.internal;
        this.pn = data.pn;
        this.ian = new InAppTrigger(data.ian);
    }

}
