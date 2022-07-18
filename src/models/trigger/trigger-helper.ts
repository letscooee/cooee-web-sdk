import {Constants} from '../../constants';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {EmbeddedTrigger} from './embedded-trigger';
import {TriggerData} from './trigger-data';

/**
 * A small helper class for any kind of engagement trigger like caching or retrieving from local storage.
 *
 * @author Abhishek Taparia
 * @since 0.0.7
 */
export class TriggerHelper {

    /**
     * Store the current active trigger details in local storage for "late engagement tracking".
     * @param triggerData trigger data
     */
    static storeActiveTrigger(triggerData: TriggerData): void {
        if (triggerData.id === 'test') {
            return;
        }

        let activeTriggers = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGERS) as EmbeddedTrigger[];

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

    /**
     * Get the list of non-expired active triggers from local storage for "late engagement tracking".
     *
     * @return EmbeddedTrigger[] list of active triggers
     */
    static getActiveTriggers(): EmbeddedTrigger[] {
        const activeTriggers = LocalStorageHelper.getArray(Constants.STORAGE_ACTIVE_TRIGGERS) as EmbeddedTrigger[];

        if (!activeTriggers) {
            return [];
        }

        activeTriggers.forEach((trigger, index, array) => {
            if (new EmbeddedTrigger(trigger).isExpired) {
                array.splice(index, 1);
            }
        });

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGERS, activeTriggers);

        return activeTriggers;
    }

}
