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
    static storeActiveTrigger(triggerData: TriggerData | undefined): EmbeddedTrigger | undefined {
        if (!triggerData?.id || triggerData.id === 'test') {
            return;
        }

        const embeddedTrigger = new EmbeddedTrigger(triggerData);

        LocalStorageHelper.setObject(Constants.STORAGE_ACTIVE_TRIGGER, embeddedTrigger);
        return embeddedTrigger;
    }

}
