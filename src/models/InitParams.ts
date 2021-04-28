export class InitParams {
    constructor(
        readonly appID: string,
        readonly appSecret: string,
        readonly device: { os: string, cooeeSdkVersion: string, appVersion: string, osVersion: string | number }
    ) { }
}