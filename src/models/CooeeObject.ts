export class CooeeObject {

    // public sdkToken: string | null = null
    // public userId: string | null = null
    // public sessionId: string | null = null

    constructor(
        readonly userId: string,
        readonly sessionId: string,
        readonly sdktoken: string) {
    }
}