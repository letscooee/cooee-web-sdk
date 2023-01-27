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
     *
     * @param triggerData The current trigger data.
     * @return Current active triggers.
     */
    static storeActiveTrigger(triggerData: TriggerData | undefined): EmbeddedTrigger[] {
        if (!triggerData?.id || triggerData.id === 'test') {
            return [];
        }

        const activeTriggers = LocalStorageHelper.getArray<EmbeddedTrigger>(Constants.STORAGE_ACTIVE_TRIGGERS);
        const embeddedTrigger = new EmbeddedTrigger(triggerData);

        if (!embeddedTrigger.isExpired()) {
            const index = activeTriggers.findIndex((trigger) => trigger.triggerID === embeddedTrigger.triggerID);
            // Prevent duplicate
            if (index === -1) {
                activeTriggers.push(embeddedTrigger);
            }
        }

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGER, embeddedTrigger);
        LocalStorageHelper.setArray(Constants.STORAGE_ACTIVE_TRIGGERS, activeTriggers);
        return activeTriggers;
    }

    /**
     * Get the list of non-expired active triggers from local storage for "late engagement tracking".
     *
     * @return EmbeddedTrigger[] list of active triggers
     */
    static getActiveTriggers(): EmbeddedTrigger[] {
        const activeTriggers = LocalStorageHelper.getArray<EmbeddedTrigger>(Constants.STORAGE_ACTIVE_TRIGGERS);

        activeTriggers.forEach((trigger, index, array) => {
            if (new EmbeddedTrigger(trigger).isExpired()) {
                array.splice(index, 1);
            }
        });

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGERS, activeTriggers);

        return activeTriggers;
    }

}
