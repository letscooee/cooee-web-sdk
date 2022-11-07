import {Props} from '../../types';
import {EmbeddedTrigger} from '../trigger/embedded-trigger';
import {ObjectId} from 'bson';

/**
 * Event class is sent as body to server when a user event needs to be tracked.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class Event {

    public sessionID: string | null = null;
    public screenName: string | null = null;
    public deviceProps: Props | null = null;
    public sessionNumber: number = 0;
    public activeTriggers: EmbeddedTrigger[] = [];

    private readonly id: ObjectId;
    private readonly occurred: string;

    /**
     * Public constructor
     *
     * @param {string} name event name
     * @param {props} properties event properties.
     * @param trigger
     */
    constructor(
        readonly name: string,
        readonly properties: Props = {},
        readonly trigger?: EmbeddedTrigger,
    ) {
        this.id = new ObjectId();
        this.occurred = new Date().toISOString();
    }

}
