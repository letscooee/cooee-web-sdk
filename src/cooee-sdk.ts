import {sendEvent, userInit} from "./api-call-methods/api-call-methods";
import {getOSVersion} from "./init/PropertyCollector";
import {Event} from "./models/event";
import {InitParams} from "./models/InitParams"

export default class CooeeSDK {

    private constructor() {
    }

    static async init(appId: string, appSecret: string) {
        let config: InitParams = new InitParams(appId, appSecret, {
            appVersion: "0.1",
            cooeeSdkVersion: "0.0.1",
            os: "IOS",
            osVersion: getOSVersion().toString()
        })
        await userInit(config)
    }

    static async event(eventName: string, eventProps: {}) {
        let et = new Event(eventName, eventProps)
        sendEvent(et)
    }
}
