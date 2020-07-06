import {Competency} from './competency.enum';
import {CompetencyMapping} from './competency-mapping';

export class JobCompetency {

    private static readonly DEFAULT_WEIGHT = 60;

    id: string;
    weight: number;
    competency: Competency;

    constructor(data?: any) {
        this.update(data || {});
    }

    static getDefaultInstances(): Array<JobCompetency> {
        return CompetencyMapping.getValues().sort().map((mapping: CompetencyMapping) => {

            const jobCompetency = new JobCompetency();
            jobCompetency.weight = this.DEFAULT_WEIGHT;
            jobCompetency.competency = mapping.competency;

            return jobCompetency;
        });
    }

    update(data: any) {
        this.id = data.id;
        this.weight = data.weight;
        this.competency = data.competency;
    }
}
