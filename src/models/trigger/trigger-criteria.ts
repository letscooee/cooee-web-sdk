export enum DisplayCriteriaEnum {

    IMMEDIATELY = 1,
    AFTER_X_SECOND = 2,

}

// eslint-disable-next-line @typescript-eslint/naming-convention
export class DisplayCriteria {

    show: DisplayCriteriaEnum;
    delay: number;
    occurred: string;

    constructor(data: Partial<DisplayCriteria>) {
        data = data ?? {};

        this.show = data.show ?? DisplayCriteriaEnum.IMMEDIATELY;
        this.delay = data.delay ?? 0;
        this.occurred = data.occurred ?? new Date().toISOString();
    }

    getDelaySeconds(): number {
        const occurredTime = new Date(this.occurred);
        const currentTime = new Date();
        const passedMilliseconds = currentTime.getTime() - occurredTime.getTime();
        return (this.delay * 1000) - passedMilliseconds;
    }

}
