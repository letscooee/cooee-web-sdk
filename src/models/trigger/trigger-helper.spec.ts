import {DateUtils} from '../../utils/date-utils';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {TriggerData} from './trigger-data';
import {TriggerHelper} from './trigger-helper';

describe('TriggerHelper', () => {
    describe('storeActiveTrigger', () => {
        it('should do nothing when trigger id is missing', () => {
            expect(TriggerHelper.storeActiveTrigger(undefined)).toEqual(undefined);
        });

        it('should do nothing when trigger id has value "test"', () => {
            const triggerData = new TriggerData({id: 'test'});
            expect(TriggerHelper.storeActiveTrigger(triggerData)?.triggerID).toBeUndefined();
        });

        it('should save an embedded trigger (and prevent duplicate)', () => {
            const expireIn2Days = DateUtils.addDays(2);
            const triggerData = new TriggerData({id: '12345', expireAt: expireIn2Days});

            spyOn(LocalStorageHelper, 'setArray');
            spyOn(LocalStorageHelper, 'setObject');

            TriggerHelper.storeActiveTrigger(triggerData);
            // Store the same value twice
            const trigger = TriggerHelper.storeActiveTrigger(triggerData);

            expect(trigger?.triggerID).toEqual('12345');

            expect(LocalStorageHelper.setObject).toHaveBeenCalledTimes(2);
        });
    });
});
