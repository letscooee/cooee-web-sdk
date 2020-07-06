import {Question} from '../question/question.model';
import {Competency} from '../organization/competency.enum';
import {AnswerChoice} from '../question/answer-choice.model';
import {AnswerParameterScore} from './answer-parameter-score';

export class QuestionAnswer {

    id: string;
    question: Question;
    competency: Competency;
    chosenAnswer: AnswerChoice;
    exactAnswer: string;
    timeTaken: number;      // in seconds
    wasSkipped: boolean;
    videoRecording: string;
    totalScore: number;
    parameterScores: AnswerParameterScore[];

    constructor(data: any) {
        this.id = data.id;
        this.competency = data.competency;
        this.exactAnswer = data.exactAnswer;
        this.timeTaken = data.timeTaken;
        this.wasSkipped = data.wasSkipped;
        this.videoRecording = data.videoRecording;
        this.totalScore = data.totalScore;

        this.question = new Question(data.question);
        if (data.chosenAnswer) {
            this.chosenAnswer = new AnswerChoice(data.chosenAnswer);
        }
        if (data.parameterScores?.length) {
            this.parameterScores = data.parameterScores.map(item => {
                return new AnswerParameterScore(item);
            });
        }
    }

    isRightWrongChoiceQuestion(): boolean {
        // This is a hack for now to figure out if this question is a multiple-choice question having one correct choice with other
        // incorrect choice or any choice can be selected (like rate your self out of 5).

        // If there is at least one correct choice then this is a right-wrong question with MCQ.
        return !!this.question.choices.find(item => item.correctChoice);
    }

    isWrongChoiceSelected(choice: AnswerChoice): boolean {
        // If the answer was not selected then we can't say that it is a wrong choice
        if (!this.isChoiceSelected(choice)) {
            return false;
        }

        const isWrongRightQuestion = this.isRightWrongChoiceQuestion();
        if (!isWrongRightQuestion) {
            return false;
        }

        return !choice.correctChoice;
    }

    isChoiceSelected(choice: AnswerChoice): boolean {
        if (!this.chosenAnswer) {
            return false;
        }

        return this.chosenAnswer.id === choice.id;
    }
}
