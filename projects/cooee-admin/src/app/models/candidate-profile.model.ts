import {Stream} from './organization/stream.enum';
import {QualificationStatus} from './user/qualification-status.enum';

export class CandidateProfile {

    testsAllowed: number;
    testsInitiated: number;
    assessmentFeePaid: boolean;
    courseFeePaid: boolean;
    appliedForCourse: Date;
    qualificationStatus: QualificationStatus;
    stream: Stream;

    constructor(data?: any) {
        this.update(data || {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.testsAllowed = data.testsAllowed;
        this.testsInitiated = data.testsInitiated;
        this.courseFeePaid = data.courseFeePaid;
        this.assessmentFeePaid = data.assessmentFeePaid;
        this.appliedForCourse = data.appliedForCourse;
        this.qualificationStatus = data.qualificationStatus;
        this.stream = data.stream as Stream;
    }
}
