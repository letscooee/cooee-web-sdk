import {QuestionAnswer} from './question-answer.model';
import {Candidate} from '../candidate.model';
import {AssessmentCompetencyScore} from './assessment-competency-score.model';
import {AssessmentSpecialisationScore} from './assessment-specialisation-score.model';
import {environment} from '../../../environments/environment';
import {QualificationStatus} from '../user/qualification-status.enum';

export class AssessmentTest {

    private readonly ASSESSMENT_DELETION_HOUR_LIMIT = 2 * 60 * 60 * 1000;  // 2 hours

    id: string;
    candidate: Candidate;
    testStatus: AssessmentTestStatus;
    dateCreated: Date;
    questionAnswers: QuestionAnswer[];
    competencyScores: AssessmentCompetencyScore[];
    specialisationScores: AssessmentSpecialisationScore[];
    qualificationStatus: QualificationStatus;

    constructor(data?: any) {
        this.update(data ?? {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.candidate = new Candidate(data.candidate);
        this.testStatus = data.testStatus;
        this.dateCreated = data.dateCreated;
        this.qualificationStatus = data.qualificationStatus;

        if (data.competencyScores) {
            this.competencyScores = data.competencyScores.map(item => new AssessmentCompetencyScore(item));
        }

        if (data.specialisationScores) {
            this.updateSpecialisationScores(data.specialisationScores);
        }
    }

    updateQuestionAnswers(data: any) {
        if (data.questionAnswers) {
            this.questionAnswers = data.questionAnswers
                .map(item => new QuestionAnswer(item))
                .sort((a, b) => a.id.localeCompare(b.id));
        }
    }

    getReportURL() {
        if (!this.dateCreated) {
            return;
        }

        const apiURL = environment.apiURL;
        const dateCreated = new Date(this.dateCreated);
        const timestamp = dateCreated.getTime();

        return `${apiURL}/view-report/${this.id}?ts=${timestamp}`;
    }

    updateSpecialisationScores(scores: Array<any>) {
        this.specialisationScores = scores.map(item => new AssessmentSpecialisationScore(item));
    }

    cloneSpecialisationScores() {
        return this.specialisationScores.map(item => new AssessmentSpecialisationScore(item));
    }

    canBeDeleted() {
        const today = new Date();
        const validTimeForDeletion = new Date(this.dateCreated).getTime() + this.ASSESSMENT_DELETION_HOUR_LIMIT;
        const isAssessmentTimeEnd = (today.getTime() > validTimeForDeletion);

        return this.isNotSubmitted() && isAssessmentTimeEnd;
    }

    isNotSubmitted() {
        return this.testStatus === AssessmentTestStatus.CREATED;
    }

    /**
     * @return <code>true</code> if the assessor can request to calculate the scores for this AssessmentTest.
     */
    canScoreBeCalculated() {
        // Scores can always be recalculated if it was already calculated
        return this.testStatus === AssessmentTestStatus.CANDIDATE_SUBMITTED || this.testStatus === AssessmentTestStatus.SCORES_CALCULATED;
    }

    /**
     * Returns <code>true</code> if this AssessmentTest can be submitted by the assessor i.e. only when the status is "SCORES_CALCULATED"
     */
    canBeSubmitted() {
        return this.testStatus === AssessmentTestStatus.SCORES_CALCULATED;
    }

    isAssessmentLocked() {
        const statuses = [AssessmentTestStatus.ASSESSMENT_DONE, AssessmentTestStatus.REPORT_GENERATED];
        return statuses.indexOf(this.testStatus) > -1;
    }

    isScoreCalculated() {
        const statuses = [AssessmentTestStatus.SCORES_CALCULATED, AssessmentTestStatus.ASSESSMENT_DONE,
            AssessmentTestStatus.REPORT_GENERATED];

        return statuses.indexOf(this.testStatus) > -1;
    }
}

export enum AssessmentTestStatus {
    CREATED = 'CREATED',
    CANDIDATE_SUBMITTED = 'CANDIDATE_SUBMITTED',
    IN_REVIEW = 'IN_REVIEW',
    SCORES_CALCULATED = 'SCORES_CALCULATED',
    ASSESSMENT_DONE = 'ASSESSMENT_DONE',
    REPORT_GENERATED = 'REPORT_GENERATED'
}
