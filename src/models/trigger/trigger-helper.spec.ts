import {Constants} from '../../constants';
import {DateUtils} from '../../utils/date-utils';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {EmbeddedTrigger} from './embedded-trigger';
import {TriggerData} from './trigger-data';
import {TriggerHelper} from './trigger-helper';

describe('TriggerHelper', () => {
    describe('storeActiveTrigger', () => {
        it('should do nothing when trigger id is missing', () => {
            expect(TriggerHelper.storeActiveTrigger(undefined)).toEqual([]);
        });

        it('should do nothing when trigger id has value "test"', () => {
            const triggerData = new TriggerData({id: 'test'});
            expect(TriggerHelper.storeActiveTrigger(triggerData)).toEqual([]);
        });

        it('should save an embedded trigger (and prevent duplicate)', () => {
            const expireIn2Days = DateUtils.addDays(2);
            const triggerData = new TriggerData({id: '12345', expireAt: expireIn2Days});

            TriggerHelper.storeActiveTrigger(triggerData);
            // Add twice the same value
            const triggers = TriggerHelper.storeActiveTrigger(triggerData);

            expect(triggers.length).toEqual(1);
            expect(triggers[0].triggerID).toEqual('12345');

            const storedTrigger = LocalStorageHelper.getObject<EmbeddedTrigger>(Constants.STORAGE_ACTIVE_TRIGGER);
            const storedTriggers = LocalStorageHelper.getArray<EmbeddedTrigger>(Constants.STORAGE_ACTIVE_TRIGGERS);

            expect(storedTrigger?.triggerID).toEqual('12345');
            expect(storedTriggers.length).toEqual(1);
        });
    });
});
