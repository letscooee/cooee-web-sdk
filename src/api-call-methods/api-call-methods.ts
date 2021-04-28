import { getBatteryPercentage, getBrowser, getBrowserVersion, getNetworkType, getOSVersion, getDeviceMemory, getOS, getModel, getDeviceLocale, getScreenResolution, getDpi, getOrientation, getLocation } from "../init/PropertyCollector.js";
import { CooeeEvent } from "../models/CooeeEvent.js";
import { InitParams } from "../models/InitParams.js";

const myUrl = "http://127.0.0.1:3003"

export async function userInit(config: InitParams) {
    if (!window.localStorage.getItem("cooee-sdk-token")) {

        var raw = JSON.stringify({
            appID: config.appID,
            appSecret: config.appSecret,
            deviceData: config.device
        });

        var requestOptions = {
            method: 'POST',
            body: raw,
        };

        let res = await fetch(myUrl + "/v1/user/save", requestOptions)

        let xy = await res.json()

        window.localStorage.setItem("cooee-id", xy.id)
        window.localStorage.setItem("cooee-session-id", xy.sessionID)
        window.localStorage.setItem("cooee-sdk-token", xy.sdkToken)
        window.localStorage.setItem("cooee-session-number", "1")

        let eventProps: any = {}
        getBatteryPercentage(function (level: string) {
            eventProps["CE Device Battery"] = level
        })
        eventProps["CE Source"] = "SYSTEM"
        eventProps["CE OS Version"] = getOSVersion()
        eventProps["CE OS"] = getOS()
        eventProps["CE Network Type"] = getNetworkType()
        eventProps["CE Browser"] = getBrowser()
        eventProps["CE Browser Version"] = getBrowserVersion()

        let event = new CooeeEvent("CE First Launch", eventProps)
        sendEvent(event)
    }
    else {
        let sessionNumber = Number(window.localStorage.getItem("cooee-session-number")) + 1
        window.localStorage.setItem("cooee-session-number", sessionNumber.toString())

        let eventProps: any = {}
        getBatteryPercentage(function (level: string) {
            eventProps["CE Device Battery"] = level
        })
        eventProps["CE Source"] = "SYSTEM"
        eventProps["CE OS Version"] = getOSVersion().toString()
        eventProps["CE OS"] = getOS()
        eventProps["CE Network Type"] = getNetworkType()
        eventProps["CE Browser"] = getBrowser()
        eventProps["CE Browser Version"] = getBrowserVersion().toString()

        let event = new CooeeEvent("CE App Launched", eventProps)
        sendEvent(event)
    }

    let userProperties: any = {}
    getBatteryPercentage(function (level: string) {
        userProperties["CE Device Battery"] = level
    })
    userProperties["CE OS Version"] = getOSVersion().toString()
    userProperties["CE Network Type"] = getNetworkType()
    userProperties["CE Browser"] = getBrowser()
    userProperties["CE Browser Version"] = getBrowserVersion().toString()
    userProperties["CE Device Model"] = getModel()
    userProperties["CE Total RAM"] = getDeviceMemory().toString()
    userProperties["CE Device Locale"] = getDeviceLocale()
    userProperties["CE OS"] = getOS()
    userProperties["CE Screen Resolution"] = getScreenResolution()
    userProperties["CE DPI"] = getDpi().toString()
    userProperties["CE Orientation"] = getOrientation()
    getLocation(function (location: any) {
        userProperties["CE Latitude"] = location.latitude.toString()
        userProperties["CE Longitude"] = location.longitude.toString()
    })
    updateProfile({}, userProperties)
}

export async function sendEvent(eve: CooeeEvent) {
    eve.screenName = location.pathname.substring(1)
    eve.sessionNumber = window.localStorage.getItem("cooee-session-number")!
    if (eve.name !== "CE App Launched") {
        eve.sessionID = window.localStorage.getItem("cooee-session-id")!
    }

    var raw = JSON.stringify(eve);
    var myHeaders = new Headers()
    myHeaders.append("x-sdk-token", window.localStorage.getItem("cooee-sdk-token")!)

    var requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders
    };

    let res = await fetch(myUrl + "/v1/event/track", requestOptions)

    let resData = await res.json()

    if (resData.sessionID) {
        window.localStorage.setItem("cooee-session-id", resData.sessionID)
    }
}

export async function updateProfile(userData: object, userProperties: object) {
    var sessionID = window.localStorage.getItem("cooee-session-id")!

    var raw = JSON.stringify({
        userData: userData,
        userProperties: userProperties,
        sessionID: sessionID
    });

    var myHeaders = new Headers()
    myHeaders.append("x-sdk-token", window.localStorage.getItem("cooee-sdk-token")!)

    var requestOptions = {
        method: 'PUT',
        body: raw,
        headers: myHeaders
    };

    let res = await fetch(myUrl + "/v1/user/update", requestOptions)

    await res.json()
}