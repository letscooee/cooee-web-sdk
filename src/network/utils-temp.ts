import {Event} from '../models/event';
import {Constants} from '../constants';

// TODO remove this completely

export async function userInit(config: any) {
    if (!window.localStorage.getItem('cooee-sdk-token')) {

        const raw = JSON.stringify({
            appID: config.appID,
            appSecret: config.appSecret,
            deviceData: config.device,
        });

        const requestOptions = {
            method: 'POST',
            body: raw,
        };

        const res = await fetch(Constants.API_URL + '/v1/user/save', requestOptions);

        const xy = await res.json();

        window.localStorage.setItem('cooee-id', xy.id);
        window.localStorage.setItem('cooee-session-id', xy.sessionID);
        window.localStorage.setItem('cooee-sdk-token', xy.sdkToken);
        window.localStorage.setItem('cooee-session-number', '1');

        const eventProps: any = {};
        const event = new Event('CE First Launch', eventProps);
        sendEvent(event);
    } else {
        const sessionNumber = Number(window.localStorage.getItem('cooee-session-number')) + 1;
        window.localStorage.setItem('cooee-session-number', sessionNumber.toString());

        const eventProps: any = {};
        const event = new Event('CE App Launched', eventProps);
        sendEvent(event);
    }

    const userProperties: any = {};
    updateProfile({}, userProperties);
}

export async function sendEvent(eve: Event) {
    eve.screenName = location.pathname.substring(1);
    eve.sessionNumber = window.localStorage.getItem('cooee-session-number')!;
    if (eve.name !== 'CE App Launched') {
        eve.sessionID = window.localStorage.getItem('cooee-session-id')!;
    }

    const raw = JSON.stringify(eve);
    const myHeaders = new Headers();
    myHeaders.append('x-sdk-token', window.localStorage.getItem('cooee-sdk-token')!);

    const requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders,
    };

    const res = await fetch(Constants.API_URL + '/v1/event/track', requestOptions);

    const resData = await res.json();

    if (resData.sessionID) {
        window.localStorage.setItem('cooee-session-id', resData.sessionID);
    }
}

export async function updateProfile(userData: object, userProperties: object) {
    const sessionID = window.localStorage.getItem('cooee-session-id')!;

    const raw = JSON.stringify({
        userData: userData,
        userProperties: userProperties,
        sessionID: sessionID,
    });

    const myHeaders = new Headers();
    myHeaders.append('x-sdk-token', window.localStorage.getItem('cooee-sdk-token')!);

    const requestOptions = {
        method: 'PUT',
        body: raw,
        headers: myHeaders,
    };

    const res = await fetch(Constants.API_URL + '/v1/user/update', requestOptions);

    await res.json();
}
