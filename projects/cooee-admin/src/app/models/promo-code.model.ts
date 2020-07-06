export class PromoCode {

    mobile: string;
    code: string;
    validTill: Date;
    discountType: string;
    discountAmount: string;
    dateCreated: Date;

    constructor(data?: any) {
        data = data || {};
        this.update(data);
    }

    update(data: any): void {
        this.mobile = data.mobile;
        this.code = data.code;
        this.validTill = new Date(data.validTill);
        this.discountType = data.discountType;
        this.discountAmount = data.discountAmount;
        this.dateCreated = new Date(data.dateCreated);
    }

    isExpired() {
        const currentTime = new Date().getTime();
        const validationTillTime = this.validTill.getTime();

        return currentTime > validationTillTime;
    }
}