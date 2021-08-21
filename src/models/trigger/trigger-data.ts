/**
 * This store the payload sent by server to render trigger.
 */
export class TriggerData {

    // TODO implement this on trigger implementation
    id: string;
    duration: number = 0;

    /**
     * Public constructor
     *
     * @param {any} data payload
     */
    constructor(data: any) {
        this.id = data.id;
        this.duration = data.duration;
    }

}
