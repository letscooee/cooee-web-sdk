import {Competency} from '../organization/competency.enum';
import {CorrectAnswer} from './correct-answer.model';
import {AnswerChoice} from './answer-choice.model';
import {CompetencyMapping, QuestionConstraints} from '../organization/competency-mapping';
import {Stream} from '../organization/stream.enum';

export class Question {

    id: string;
    title: string;
    competency: Competency;
    stream: Stream;
    status: QuestionStatus;
    exactAnswers: CorrectAnswer[];
    dateCreated: Date;
    lastUpdated: Date;
    version: number;
    choices: AnswerChoice[];
    subQuestions: SubQuestion[];

    private _competencyMapping: CompetencyMapping;
    private _constraints: QuestionConstraints;

    constructor(data?: any) {
        data = data ?? {};
        this.update(data);
    }

    // TODO workaround for transient fields in TypeScript
    deleteTransientFields() {
        delete this._competencyMapping;
        delete this._constraints;
    }

    update(data: any) {
        this.id = data.id;
        this.title = data.title || '';
        this.competency = data.competency;
        this.stream = data.stream;
        this.status = data.status;
        this.dateCreated = data.dateCreated;
        this.lastUpdated = data.lastUpdated;
        this.version = data.version;

        this.setupMappingAndConstraints();

        if (data.exactAnswers) {
            this.exactAnswers = data.exactAnswers.map(item => new CorrectAnswer(item));
        } else {
            this.exactAnswers = [];
        }

        if (data.choices) {
            this.choices = data.choices.map(item => new AnswerChoice(item));
        } else {
            this.choices = [];
        }

        if (data.subQuestions) {
            this.subQuestions = data.subQuestions.map(item => new SubQuestion(item));
        } else {
            this.subQuestions = [];
        }
    }

    get constraints(): QuestionConstraints {
        return this._constraints;
    }

    // This method is being called in the view
    getCompetencyLabel(): string {
        return this._competencyMapping?.label;
    }

    private setupMappingAndConstraints() {
        if (!this.competency) {
            delete this._constraints;
            delete this._competencyMapping;
            return;
        }

        const mapping = CompetencyMapping.getFlattenMappings().find((item) => {
            return item.competency === this.competency;
        });

        this._competencyMapping = mapping;
        this._constraints = this.isParentQuestion() ? mapping.questionConstraint : mapping.subQuestionConstraint;
    }

    competencyChanged(): void {
        this.setupMappingAndConstraints();

        if (!this.competency) {
            this.choices.length = 0;
            this.subQuestions.length = 0;
            this.exactAnswers.length = 0;
            return;
        }

        // Do not set the default choices when this is an edit form
        if (!this.id && this._constraints?.defaultChoices) {
            this.choices = this._constraints.defaultChoices.map(item => item.clone());
        }

        this.maintainMinimumChoices();
        this.maintainMinimumExactAnswers();
        this.maintainMinimumSubQuestions();
    }

    isParentQuestion(): boolean {
        return !(this instanceof SubQuestion);
    }

    /**
     * Add minimum choices to {@link #choices} based on the competency mapping.
     */
    maintainMinimumChoices() {
        if (this._constraints?.minimumChoices) {
            const diff = this._constraints.minimumChoices - this.choices.length;
            // Means we already have minimum choices
            if (diff < 1) {
                return;
            }

            Array.from(Array(diff)).forEach(() => {
                this.addNewAnswerChoice();
            });
        } else {
            // If this question does not require choices then empty the list at all
            this.choices.length = 0;
        }
    }

    /**
     * Add minimum choices to {@link #choices} based on the competency mapping.
     */
    maintainMinimumSubQuestions() {
        if (this._constraints?.minimumSubQuestions) {
            const diff = this._constraints.minimumSubQuestions - this.subQuestions.length;
            if (diff < 1) {
                return;
            }

            Array.from(Array(diff)).forEach(() => {
                this.addNewSubQuestion();
            });
        } else {
            this.subQuestions.length = 0;
        }
    }

    /**
     * Add minimum number of {@link CorrectAnswer} required for this question.
     */
    maintainMinimumExactAnswers() {
        if (this._constraints?.minimumExactAnswers) {
            const diff = this._constraints.minimumExactAnswers - this.exactAnswers.length;
            // Means we already have minimum "exact answer"
            if (diff < 1) {
                return;
            }

            Array.from(Array(diff)).forEach(() => {
                this.addNewExactAnswer();
            });
        } else {
            // If this question does not require exact answers then empty the list completely
            this.exactAnswers.length = 0;
        }
    }

    /**
     * Add a new instance of {@link CorrectAnswer} to {@link #choices} field.
     */
    addNewAnswerChoice(): void {
        this.choices.push(new AnswerChoice());
    }

    /**
     * Add a new instance of {@link CorrectAnswer} to {@link #choices} field.
     */
    addNewSubQuestion(): void {
        const subQuestion = new SubQuestion({
            competency: this.competency,
            stream: this.stream
        });

        subQuestion.competencyChanged();

        this.subQuestions.push(subQuestion);
    }

    /**
     * Add a new {@link CorrectAnswer} to {@link #exactAnswers} field.
     */
    addNewExactAnswer(): void {
        this.exactAnswers.push(new CorrectAnswer({score: 1}));
    }

    /**
     * Remove a given choice from the choices and maintain the minimum choices.
     * @param choice
     */
    removeAnswerChoice(choice: AnswerChoice): void {
        const index = this.choices.indexOf(choice);
        this.choices.splice(index, 1);
        this.maintainMinimumChoices();
    }

    removeSubQuestion(subQuestion: SubQuestion): void {
        const index = this.subQuestions.indexOf(subQuestion);
        this.subQuestions.splice(index, 1);
        this.maintainMinimumSubQuestions();
    }

    /**
     * Remove a given choice from the choices and maintain the minimum choices.
     * @param exactAnswer
     */
    removeExactAnswer(exactAnswer: CorrectAnswer): void {
        const index = this.exactAnswers.indexOf(exactAnswer);
        this.exactAnswers.splice(index, 1);
        this.maintainMinimumExactAnswers();
    }

    clone(): Question {
        return new Question(this);
    }
}

export class SubQuestion extends Question {

    constructor(data) {
        super(data);
    }
}

export enum QuestionStatus {

    ACTIVE = 'ACTIVE',
    DRAFT = 'DRAFT',
    INACTIVE = 'INACTIVE'
}
