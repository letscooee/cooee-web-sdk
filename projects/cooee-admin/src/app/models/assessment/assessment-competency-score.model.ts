import {Competency} from '../organization/competency.enum';

export class AssessmentCompetencyScore {

    competency: Competency;
    totalScore: number;

    constructor(data?: any) {
        this.update(data ?? {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.competency = data.competency;
        this.totalScore = data.totalScore;
    }

}
