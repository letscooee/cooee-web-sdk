export class TriggerData {

    id: string;
    duration: number = 0;

    constructor(data: any) {
        this.id = data.id;
        this.duration = data.duration;
    }
}