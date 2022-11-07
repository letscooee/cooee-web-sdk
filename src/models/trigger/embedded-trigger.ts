/**
 * This class store data related to triggers which are active/activated by clicking on the trigger notification or by
 * looking an in-app trigger(in future). This would be commonly sent with events as <code>activeTrigger</code>.
 *
 * @author Abhishek Taparia
 * @since 1.1.0
 */
export class EmbeddedTrigger {

    triggerID: string;
    engagementID: string;
    expireAt: number;
    expired?: boolean;

    constructor(data: Record<string, any>) {
        this.triggerID = data.id;
        this.engagementID = data.engagementID;
        this.expireAt = data.expireAt;

        this.updateExpired();
    }

    get isExpired(): boolean {
        return this.expireAt < new Date().getTime();
    }

    updateExpired(): void {
        if (this.isExpired) {
            this.expired = true;
        }
    }

}
