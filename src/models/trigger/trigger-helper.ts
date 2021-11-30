import {TriggerData} from './trigger-data';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {Constants} from '../../constants';
import {EmbeddedTrigger} from './embedded-trigger';

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

    /**
     * Get the list of non-expired active triggers from local storage for "late engagement tracking".
     *
     * @return EmbeddedTrigger[] list of active triggers
     */
    static getActiveTriggers(): EmbeddedTrigger[] {
        const activeTriggers: EmbeddedTrigger[] = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGERS);

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
