import {Competency} from './competency.enum';
import {AnswerChoice} from '../question/answer-choice.model';
import {QuestionType} from '../question/question-type-enum';

const DEFAULT_YES_NO_CHOICES: AnswerChoice[] = [
    new AnswerChoice({score: 1, text: 'Yes'}),
    new AnswerChoice({score: 0, text: 'No'})
];

const DEFAULT_5_WEIGHT_CHOICES: AnswerChoice[] = [
    new AnswerChoice({score: 1, text: 'Not at all'}),
    new AnswerChoice({score: 2, text: 'Rarely'}),
    new AnswerChoice({score: 3, text: 'Sometimes'}),
    new AnswerChoice({score: 4, text: 'Often'}),
    new AnswerChoice({score: 5, text: 'Very Often'})
];

export class CompetencyMapping {

    private static readonly FLATTEN_MAPPINGS: CompetencyMapping[] = [];

    private static readonly MAPPINGS = [
        // Competency 1
        new CompetencyMapping(Competency.DOMAIN, 'Domain', QuestionType.MULTIPLE_CHOICE,
            {streamRequired: true, minimumChoices: 2}
        ),

        // Competency 2
        new CompetencyMapping(Competency.EMOTIONAL_INTELLIGENCE, 'Emotional Intelligence', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2, defaultChoices: DEFAULT_5_WEIGHT_CHOICES}
        ),

        // Competency 3
        new CompetencyMapping(Competency.SELF_LEADERSHIP, 'Self Leadership', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2, defaultChoices: DEFAULT_5_WEIGHT_CHOICES}
        ),

        // Competency 4
        new CompetencyMapping(Competency.GENERAL_AWARENESS, 'General Awareness', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2}
        ),

        // Competency 5
        new CompetencyMapping(Competency.APTITUDE, 'Aptitude', QuestionType.SUB_QUESTIONS,
            {},
            {},
            [
                // Competency 5.1
                new CompetencyMapping(Competency.APTITUDE_WORD_FORMATION, 'Word Formation', QuestionType.EXACT_ANSWER,
                    {minimumExactAnswers: 1}),

                // Competency 5.2
                new CompetencyMapping(Competency.APTITUDE_LINGUISTIC_REASONING, 'Linguistic Reasoning', QuestionType.MULTIPLE_CHOICE,
                    {minimumChoices: 2}),

                // Competency 5.3
                new CompetencyMapping(Competency.APTITUDE_ANALOGIES, 'Analogies', QuestionType.MULTIPLE_CHOICE,
                    {minimumChoices: 2}),

                // Competency 5.4
                new CompetencyMapping(Competency.APTITUDE_NUMBER_SEQUENCE, 'Number Sequence', QuestionType.EXACT_ANSWER,
                    {minimumExactAnswers: 1}),

                // Competency 5.5
                new CompetencyMapping(Competency.APTITUDE_WORD_SEQUENCE, 'Word Sequence', QuestionType.MULTIPLE_CHOICE,
                    {minimumSubQuestions: 2},
                    {minimumChoices: 2}),

                // Competency 5.6
                new CompetencyMapping(Competency.APTITUDE_RECALLING_TEXT, 'Recalling Text', QuestionType.MULTIPLE_CHOICE,
                    {minimumSubQuestions: 2},
                    {minimumChoices: 2})
            ]
        ),

        // Competency 6
        new CompetencyMapping(Competency.SOCIAL_MEDIA_INTELLIGENCE, 'Social Media Intelligence', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2, defaultChoices: DEFAULT_YES_NO_CHOICES}
        ),

        // Competency 7
        new CompetencyMapping(Competency.CREATIVITY, 'Creativity', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2, defaultChoices: DEFAULT_5_WEIGHT_CHOICES}
        ),

        // Competency 8
        new CompetencyMapping(Competency.RESILIENCY, 'Resiliency', QuestionType.MULTIPLE_CHOICE,
            {minimumChoices: 2, defaultChoices: DEFAULT_5_WEIGHT_CHOICES}
        ),

        // Competency 9
        new CompetencyMapping(Competency.ADAPTABILITY, 'Adaptability', QuestionType.VIDEO),

        // Competency 10
        new CompetencyMapping(Competency.CREATIVE_THINKING, 'Creative Thinking', QuestionType.VIDEO)
    ];

    competency: Competency;
    label: string;
    questionType: QuestionType;
    children: CompetencyMapping[];
    questionConstraint: QuestionConstraints;
    subQuestionConstraint: QuestionConstraints;

    constructor(competency: Competency,
                label: string,
                questionType: QuestionType,
                questionConstraint?: QuestionConstraints,
                subQuestionConstraint?: QuestionConstraints,
                children?: CompetencyMapping[]) {

        this.competency = competency;
        this.label = label;
        this.questionType = questionType;
        this.children = children;
        this.questionConstraint = questionConstraint;
        this.subQuestionConstraint = subQuestionConstraint;
    }

    static getValues(): Array<CompetencyMapping> {
        return this.MAPPINGS;
    }

    static getFlattenMappings(): Array<CompetencyMapping> {
        if (!this.FLATTEN_MAPPINGS.length) {

            this.MAPPINGS.forEach((item) => {
                this.FLATTEN_MAPPINGS.push(item);

                if (item.hasChildren()) {
                    this.FLATTEN_MAPPINGS.push(...item.children);
                }
            });
        }

        return this.FLATTEN_MAPPINGS;
    }

    isMultipleChoiceQuestion() {
        return this.questionType === QuestionType.MULTIPLE_CHOICE;
    }

    isExactAnswerQuestion() {
        return this.questionType === QuestionType.EXACT_ANSWER;
    }

    isVideoQuestion() {
        return this.questionType === QuestionType.VIDEO;
    }

    hasChildren(): boolean {
        return this.children && this.children.length > 0;
    }

    /**
     * Return labels like "1. Domain" or "5.1
     * @param index
     * @param parentIndex
     */
    getLabelForMatSelect(index: number, parentIndex?: number) {
        if (parentIndex) {
            return `${parentIndex + 1}.${index + 1}. ${this.label}`;
        }

        return `${index + 1}. ${this.label}`;
    }
}

/**
 * An interface to define various validations on the {@link Question} based on a {@link Competency}.
 */
export interface QuestionConstraints {

    streamRequired?: boolean;
    minimumChoices?: number;
    minimumSubQuestions?: number;
    minimumExactAnswers?: number;
    defaultChoices?: AnswerChoice[];
}
