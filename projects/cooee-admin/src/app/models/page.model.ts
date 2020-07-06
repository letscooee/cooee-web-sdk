export class Page {

    pageType: PageType;
    text: string;

    constructor(type: PageType, data?: any) {
        data = data || {};
        this.pageType = type;
        this.update(data);
    }

    update(data: any): void {
        this.text = data.text || '';
    }
}

export enum PageType {
    REFUND_POLICY = 'REFUND_POLICY',
    TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
    PRIVACY_POLICY = 'PRIVACY_POLICY'
}
