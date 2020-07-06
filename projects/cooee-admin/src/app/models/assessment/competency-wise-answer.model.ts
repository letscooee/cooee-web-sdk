import {Competency} from '../organization/competency.enum';
import {QuestionAnswer} from './question-answer.model';
import {CompetencyMapping} from '../organization/competency-mapping';

export class CompetencyWiseAnswer {

    competency: Competency;
    competencyMapping: CompetencyMapping;
    questionAnswers: QuestionAnswer[] = [];

    static process(questionAnswers: QuestionAnswer[]): CompetencyWiseAnswer[] {
        const competencies: CompetencyWiseAnswer[] = [];

        CompetencyMapping.getFlattenMappings().forEach(mapping => {

            if (mapping.children?.length) {
                return;
            }

            const competencyWiseAnswer = new CompetencyWiseAnswer();
            competencyWiseAnswer.competencyMapping = mapping;
            competencyWiseAnswer.competency = mapping.competency;
            competencyWiseAnswer.questionAnswers = [];

            competencies.push(competencyWiseAnswer);
        });

        questionAnswers.forEach(questionAnswer => {
            const competencyWiseAnswer = competencies.find(item => item.competency === questionAnswer.competency);
            competencyWiseAnswer.questionAnswers.push(questionAnswer);
        });

        return competencies;
    }
}
