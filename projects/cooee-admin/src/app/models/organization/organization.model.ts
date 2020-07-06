import {Industry} from './industry.enum';
import {Address} from '../address.model';
import {Document} from './document.model';

export class Organization {

    id: string;
    internalName: string;
    publicName: string;
    website: string;
    industry: Industry;
    organizationType: OrganizationType;
    address: Address;
    dateCreated: Date;
    lastUpdated: Date;

    constructor(data?: any) {
        this.update(data || {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.internalName = data.internalName;
        this.publicName = data.publicName;
        this.website = data.website;
        this.industry = data.industry;
        this.organizationType = data.organizationType;
        this.address = data.address;
        this.lastUpdated = data.lastUpdated;
        this.address = new Address(data.address);
    }
}

export enum OrganizationType {

    COMPANY = 'COMPANY',
    COLLEGE = 'COLLEGE',
    SCHOOL = 'SCHOOL'
}

export interface DocumentData {
    title: string;
    document: Document;
    spinnerKey: string;
}
