import {TriggerData} from './trigger-data';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {Constants} from '../../constants';
import {EmbeddedTrigger} from './embedded-trigger';

export class TriggerHelper {

    static storeActiveTrigger(triggerData: TriggerData): void {
        let activeTriggers: EmbeddedTrigger[] = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGERS);

        if (!activeTriggers) {
            activeTriggers = [];
        }

        const embeddedTrigger: EmbeddedTrigger = new EmbeddedTrigger(triggerData);

        if (!embeddedTrigger.isExpired) {
            activeTriggers.push(embeddedTrigger);
        }

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGER, embeddedTrigger);
        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGERS, activeTriggers);
    }

    static getActiveTriggers(): EmbeddedTrigger[] {
        const activeTriggers: EmbeddedTrigger[] = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGERS);
        if (!activeTriggers) {
            return [];
        }

        activeTriggers.forEach((trigger, index, array) => {
            console.log(typeof trigger, trigger.isExpired);
            if (new EmbeddedTrigger(trigger).isExpired) {
                array.splice(index, 1);
            }
        });

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGERS, activeTriggers);

        return activeTriggers;
    }

}
