export class Faq {

    id: string;
    question: string;
    answer: string;
    weight: number;
    audience: FaqAudience;
    dateCreated: Date;

    constructor(data?: any) {
        this.update(data || {});
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.weight = data.weight;
        this.question = data.question;
        this.answer = data.answer;
        this.audience = data.audience;
        this.dateCreated = data.dateCreated;
    }
}

export enum FaqAudience {

    STUDENTS = 'STUDENTS',
    FACULTIES = 'FACULTIES'
}
