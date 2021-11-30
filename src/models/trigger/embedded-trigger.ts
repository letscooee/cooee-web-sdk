export class EmbeddedTrigger {

    triggerID: string;
    engagementID: string;
    expireAt: number;
    expired?: boolean;

    constructor(data: Record<string, any>) {
        this.triggerID = data.id;
        this.engagementID = data.engagementID;
        this.expireAt = data.expireAt;

        if (this.isExpired) {
            this.expired = this.isExpired;
        }
    }

    get isExpired(): boolean {
        return this.expireAt < new Date().getTime();
    }

}
