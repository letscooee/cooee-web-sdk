import {Event} from "../models/event";
import {Constants} from "../constants";

// TODO remove this completely

export async function userInit(config: any) {
    if (!window.localStorage.getItem("cooee-sdk-token")) {

        const raw = JSON.stringify({
            appID: config.appID,
            appSecret: config.appSecret,
            deviceData: config.device
        });

        const requestOptions = {
            method: 'POST',
            body: raw,
        };

        let res = await fetch(Constants.API_URL + "/v1/user/save", requestOptions)

        let xy = await res.json()

        window.localStorage.setItem("cooee-id", xy.id)
        window.localStorage.setItem("cooee-session-id", xy.sessionID)
        window.localStorage.setItem("cooee-sdk-token", xy.sdkToken)
        window.localStorage.setItem("cooee-session-number", "1")

        let eventProps: any = {}
        let event = new Event("CE First Launch", eventProps)
        sendEvent(event)
    } else {
        let sessionNumber = Number(window.localStorage.getItem("cooee-session-number")) + 1
        window.localStorage.setItem("cooee-session-number", sessionNumber.toString())

        let eventProps: any = {}
        let event = new Event("CE App Launched", eventProps)
        sendEvent(event)
    }

    let userProperties: any = {}
    updateProfile({}, userProperties)
}

export async function sendEvent(eve: Event) {
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

    let res = await fetch(Constants.API_URL + "/v1/event/track", requestOptions)

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

    let res = await fetch(Constants.API_URL + "/v1/user/update", requestOptions)

    await res.json()
}