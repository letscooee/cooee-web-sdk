import {sendEvent, userInit} from "./api-call-methods/api-call-methods";
import {getOSVersion} from "./init/PropertyCollector";
import {CooeeEvent} from "./models/CooeeEvent";
import {InitParams} from "./models/InitParams"

export class CooeeSDK {

    constructor() {
    }

    async init(appId: string, appSecret: string) {
        let config: InitParams = new InitParams(appId, appSecret, {
            appVersion: "0.1",
            cooeeSdkVersion: "0.0.1",
            os: "IOS",
            osVersion: getOSVersion().toString()
        })
        await userInit(config)
    }

    async event(eventName: string, eventProps: {}) {
        let et = new CooeeEvent(eventName, eventProps)
        sendEvent(et)
    }
}
