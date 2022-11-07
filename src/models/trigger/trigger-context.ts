import {TriggerData} from './trigger-data';

/**
 *  A simple data holder class shared across different renderers.
 *
 * @author Abhishek Taparia
 * @since 0.0.31
 */
export class TriggerContext {

    constructor(
        private _startTime: Date,
        private _triggerData: TriggerData) {
    }

    get startTime(): Date {
        return this._startTime;
    }

    get triggerData(): TriggerData {
        return this._triggerData;
    }

}
