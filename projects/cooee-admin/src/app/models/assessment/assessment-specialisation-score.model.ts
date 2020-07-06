import {Specialisation} from '../organization/specialisation.enum';

export class AssessmentSpecialisationScore {

    id: number;
    specialisation: Specialisation;
    requiredScore: number;
    score: number;
    gap: number;

    constructor(data?: any) {
        this.update(data ?? {});
    }

    update(data: any) {
        this.id = data.id;
        this.specialisation = data.specialisation;
        this.requiredScore = data.requiredScore;
        this.score = data.score;
        this.gap = data.gap;
    }
}
