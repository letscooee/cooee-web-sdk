import {CandidateProfile} from './candidate-profile.model';
import {User} from './user.model';

export class Candidate extends User {

    candidateProfile: CandidateProfile;

    constructor(data?: any) {
        super();
        this.update(data || {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        super.update(data);
        this.candidateProfile = new CandidateProfile(data.profile);
    }
}
