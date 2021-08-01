export class Event {

    public sessionID: string = '';
    public sessionNumber: string = '0';
    public screenName: string = '';
    public activeTriggers: Array<object> = [];

    constructor(
        readonly name: string,
        readonly properties: object,
    ) {
    }

}
