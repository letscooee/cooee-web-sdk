import {TriggerData} from './trigger-data';
import {Constants} from '../../constants';

/**
 *  A simple data holder class shared across different renderers.
 *
 * @author Abhishek Taparia
 * @since 0.0.31
 */
export class TriggerContext {

    private closeCallback: (eventProps: Record<string, any>) => void;

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

    /**
     * InApp close callback.
     * This callback will be triggered as soon as {@link closeInApp} method is called
     * @param callBack callback function
     */
    onClose(callBack: (eventProps: Record<string, any>) => void): void {
        this.closeCallback = callBack;
    }

    /**
     * Calculate InApp display time and generate eventProperties by adding closeBehaviour to Record.
     * Calls callback set by the {@link onClose}
     * @param closeBehaviour Close behaviour of the InApp i.e. CTA, Close, Auto.
     */
    closeInApp(closeBehaviour: string): void {
        const diffInSeconds = (new Date().getTime() - this.startTime.getTime()) / 1000;

        const eventProps = {
            'closeBehaviour': closeBehaviour,
            'duration': diffInSeconds,
        };

        if (this.closeCallback) {
            this.closeCallback(eventProps);
        }
    }

}
