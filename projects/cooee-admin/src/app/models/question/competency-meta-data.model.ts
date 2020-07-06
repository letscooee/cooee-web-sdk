import {Competency} from '../organization/competency.enum';
import {CompetencyMapping} from '../organization/competency-mapping';

export class CompetencyMetaData {

    id: string;
    competency: Competency;
    instructionTime: number;
    questionReadingTime: number;
    timePerQuestion: number;
    timePerSubQuestion: number;
    instruction: string;
    numberOfQuestions: number;
    clubTimesPerQuestion: boolean;
    clubTimesPerSubQuestion: boolean;
    lastUpdated: Date;

    /**
     * Total number of ACTIVE questions available for this competency.
     */
    availableQuestions: number;

    constructor(data?: any) {
        this.id = data.id;
        this.competency = data.competency;
        this.instructionTime = data.instructionTime;
        this.questionReadingTime = data.questionReadingTime;
        this.timePerQuestion = data.timePerQuestion;
        this.timePerSubQuestion = data.timePerSubQuestion;
        this.numberOfQuestions = data.numberOfQuestions;
        this.clubTimesPerQuestion = data.clubTimesPerQuestion;
        this.clubTimesPerSubQuestion = data.clubTimesPerSubQuestion;
        this.instruction = data.instruction;
        this.lastUpdated = data.lastUpdated;
        this.availableQuestions = data.availableQuestions;
    }

    getCompetencyLabel(): string {
        const mapping = CompetencyMapping.getFlattenMappings().find((item) => {
            return item.competency === this.competency;
        });

        return mapping.label;
    }

    totalTimeForAllQuestions() {
        return this.timePerQuestion * this.numberOfQuestions;
    }
}
