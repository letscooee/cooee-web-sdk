export class AnswerChoice {

    private readonly DEFAULT_SCORE = 0;
    private readonly DEFAULT_CORRECT_CHOICE = false;

    id: string;
    text: string;
    score: number;
    correctChoice: boolean;
    dateCreated: Date;
    lastUpdated: Date;
    version: number;

    constructor(data?: any) {
        data = data || {};
        this.id = data.id;
        this.text = data.text;
        this.dateCreated = data.dateCreated;
        this.lastUpdated = data.lastUpdated;
        this.version = data.version;
        this.score = data.score || this.DEFAULT_SCORE;
        this.correctChoice = data.correctChoice || this.DEFAULT_CORRECT_CHOICE;
    }

    clone(): AnswerChoice {
        return new AnswerChoice(this);
    }
}
