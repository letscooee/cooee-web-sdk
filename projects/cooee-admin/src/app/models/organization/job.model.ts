import {Industry} from './industry.enum';
import {JobCompetency} from './job-competency.model';

export class Job {

    id: string;
    title: string;
    profile: string;
    industry: Industry;
    function: string;
    description: string;
    responsibilities: string;
    specifications: string;
    positions: number;
    dateCreated: Date;
    lastUpdated: Date;
    publishedOn: Date;
    status: JobStatus;

    competencies: Array<JobCompetency>;

    constructor(data?: any) {
        this.update(data || {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.title = data.title;
        this.profile = data.profile;
        this.industry = data.industry;
        this.function = data.function;
        this.description = data.description;
        this.responsibilities = data.responsibilities;
        this.specifications = data.specifications;
        this.positions = data.positions;
        this.dateCreated = data.dateCreated;
        this.lastUpdated = data.lastUpdated;
        this.publishedOn = data.publishedOn;

        if (data.competencies && data.competencies.length) {
            this.competencies = data.competencies
                .map(item => new JobCompetency(item))
                .sort((i1, i2) => i1.competency > i2.competency ? 1 : -1);
        } else {
            this.competencies = JobCompetency.getDefaultInstances();
        }
    }
}

export enum JobStatus {

    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    DEACTIVATED = 'DEACTIVATED'
}
