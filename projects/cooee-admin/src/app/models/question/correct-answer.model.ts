export class CorrectAnswer {

    id: string;
    text: string;
    score: number;
    dateCreated: Date;
    lastUpdated: Date;
    version: number;

    constructor(data?: any) {
        data = data || {};
        this.id = data.id;
        this.text = data.text;
        this.score = data.score;
        this.dateCreated = data.dateCreated;
        this.lastUpdated = data.lastUpdated;
        this.version = data.version;
    }
}

