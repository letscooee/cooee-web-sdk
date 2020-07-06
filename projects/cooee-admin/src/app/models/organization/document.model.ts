export class Document {

    dateCreated: Date;
    lastUpdated: Date;
    documentType: DocumentType;
    otherTitle?: string;
    body: string;

    constructor(docType: DocumentType, data?: any) {
        data = data || {};
        this.documentType = docType;
        this.update(data);
    }

    update(data: any): void {
        this.dateCreated = data.dateCreated;
        this.lastUpdated = data.lastUpdated;
        this.otherTitle = data.otherTitle;
        this.body = data.body || '';
    }
}

export enum DocumentType {

    POLICY = 'POLICY',
    CODE_OF_CONDUCT = 'CODE_OF_CONDUCT',
    MISSION = 'MISSION',
    VISION = 'VISION',
    VALUES = 'VALUES',
    HIERARCHY = 'HIERARCHY',
    OTHER = 'OTHER'
}
