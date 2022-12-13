import {Props} from '../../types';
import {InAppTrigger} from './inapp/in-app-trigger';

/**
 * This store the payload sent by server to render trigger.
 */
export class TriggerData {

    // TODO implement this on trigger implementation
    id: string;
    expireAt: number = new Date().getTime();
    version: number;
    engagementID: string;
    internal: boolean;
    /**
     * In order to render in-app within a mobile view, the SDK uses the ua-parser-js library based on the
     * user-agent. But for preview purposes on a desktop browser, we can't use user-agent to guess. This manual flag
     * can let the SDK know that the rendering has to be according to the mobile view.
     */
    previewType: 'mobile' | 'desktop';

    pn?: Props;
    ian?: InAppTrigger;

    /**
     * Public constructor
     *
     * @param {Props} data payload
     */
    constructor(data: Props) {
        this.id = data.id;
        this.expireAt = data.expireAt;
        this.version = data.version;
        this.engagementID = data.engagementID;
        this.internal = data.internal;
        this.pn = data.pn;
        this.ian = new InAppTrigger(data.ian);
        this.previewType = data.previewType;
    }

}
