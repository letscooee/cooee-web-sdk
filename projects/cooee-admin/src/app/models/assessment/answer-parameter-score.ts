export class AnswerParameterScore {

    id: string;
    score: number;
    parameter: string;

    constructor(data: any) {
        this.id = data.id;
        this.score = data.score;
        this.parameter = data.parameter;
    }
}
