import {TriggerData} from './trigger-data';
import {Constants} from '../../constants';

/**
 *  A simple data holder class shared across different renderers.
 *
 * @author Abhishek Taparia
 * @since 0.0.31
 */
export class TriggerContext {

    constructor(
        private _startTime: Date,
        private _triggerData: TriggerData,
    ) {
    }

    get startTime(): Date {
        return this._startTime;
    }

    get triggerData(): TriggerData {
        return this._triggerData;
    }

    /**
     * Returns name of the root div of the trigger. If test trigger, appending {@link startTime} with id.
     */
    get rootClassName(): string {
        let id = this.triggerData.id.slice(-6);
        if (id === 'test') {
            id = this.startTime.getTime().toString();
        }

        return Constants.IN_APP_WRAPPER_NAME + '-' + id;
    }

}
