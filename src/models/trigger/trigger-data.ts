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
    delay: number;

    /**
     * This field will be added by http-api service to calculate
     * delay time from the event occurrence.
     */
    occurred: string;

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
        this.ian = data.ian ? new InAppTrigger(data.ian) : undefined;
        this.previewType = data.previewType;
        this.delay = data.delay ?? 0;
        this.occurred = data.occurred ?? new Date().toISOString();
    }

    shouldDelay(): boolean {
        return this.delay > 0;
    }

    getDelaySeconds(): number {
        const occurredTime = new Date(this.occurred);
        const currentTime = new Date();
        const passedMilliseconds = currentTime.getTime() - occurredTime.getTime();
        return (this.delay * 1000) - passedMilliseconds;
    }

}
