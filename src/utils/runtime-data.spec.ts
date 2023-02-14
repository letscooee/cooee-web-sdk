import {RuntimeData} from './runtime-data';

describe('RuntimeData', () => {
    const runtimeData = RuntimeData.getInstance();

    beforeEach(() => {
    });

    describe('getTimeForActiveInSeconds', () => {
        it('should return 0 when either of dates are null', () => {
            spyOn(runtimeData, 'setInactive').and.callFake(function () {
                // @ts-ignore
                runtimeData.lastEnterActive = null;
                // @ts-ignore
                runtimeData.lastEnterInactive = null;
            });

            runtimeData.setInactive();
            expect(runtimeData.getTimeForActiveInSeconds()).toBe(0);
        });

        it('should not return negative value', () => {
            const activeDate = new Date();
            // Setting 10 seconds before
            const inactiveDate = new Date(activeDate.getTime() - 10 * 1000);

            spyOn(runtimeData, 'setInactive').and.callFake(function () {
                // @ts-ignore
                runtimeData.lastEnterInactive = inactiveDate;
            });

            runtimeData.setInactive();
            expect(runtimeData.getTimeForActiveInSeconds()).toBe(0);
        });
    });

    describe('getTimeForInactiveInSeconds', () => {
        it('should not return negative value', () => {
            // Setting 20 seconds ahead of current time
            const inactiveDate = new Date(new Date().getTime() + 20 * 1000);

            spyOn(runtimeData, 'setInactive').and.callFake(function () {
                // @ts-ignore
                runtimeData.lastEnterInactive = inactiveDate;
            });

            runtimeData.setInactive();
            expect(runtimeData.getTimeForInactiveInSeconds()).toBe(0);
        });
    });
});
