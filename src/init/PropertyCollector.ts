import { details } from "./OsAndBrowser.js"

declare global {
    interface Navigator { getBattery: Function, connection: any, mozConnection: any, webkitConnection: any, deviceMemory: any }
}

export function getModel() {
    let s = navigator.userAgent.split(" ")
    let i = s.indexOf(getOS())

    let x = s.slice(i + 2, i + 5).join(" ");
    let y = x.split("Build") || x.split("like Mac") || x.split("App")

    return y[0]
}

export function getDeviceMemory() {
    let mem = navigator.deviceMemory
    if (mem)
        return mem * 1024
    else
        return "Unknown"
}

export function getNetworkType() {
    var connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    if (connection)
        return connection.effectiveType;
    else
        return "Unknown"
}

export function getDeviceLocale() {
    return window.navigator.language
}

export function getScreenResolution() {
    let sr = window.screen.width + "X" + window.screen.height
    return sr
}

export function getOrientation() {
    return window.screen.orientation.type
}

export function getDpi() {
    let tesDiv = document.createElement("div")
    tesDiv.setAttribute("style", "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;")
    document.body.appendChild(tesDiv)
    var devicePixelRatio = window.devicePixelRatio || 1;
    let dpi_x = tesDiv.offsetWidth * devicePixelRatio;
    let dpi_y = tesDiv.offsetHeight * devicePixelRatio;
    document.body.removeChild(tesDiv)
    return dpi_x
}

export function getSDKVersion() {
    //TODO
    //console.log(version)
}

export async function getLocation(callback: Function) {
    let a = await navigator.permissions.query({ name: 'geolocation' })

    if (a.state == "granted") {
        navigator.geolocation.getCurrentPosition(position => {
            var returnValue = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            callback(returnValue)
        }, err => {
            console.log(err)
        })
    } else {
        var returnValue = {
            latitude: "Unknown",
            longitude: "Unknown"
        }
        callback(returnValue)
    }
}

export function getOS() {
    /*var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        if (/Ubuntu/.test(userAgent)) {
            os = 'Ubuntu'
        } else if (/Red/.test(userAgent)) {
            os = 'Red Hat';
        } else {
            os = "Linux"
        }
    }

    return os;*/

    return details.os.name
}

export function getOSVersion() {
    return details.os.version
}

export function getBrowser() {
    /*let browser: string = ""
    const { userAgent } = navigator

    if (userAgent.includes('Firefox/')) {
        browser = `Firefox v${userAgent.split('Firefox/')[1]} `
    } else if (userAgent.includes('Edg/')) {
        browser = `Edg v${userAgent.split('Edg/')[1]} `
    } else if (userAgent.includes('Chrome/')) {
        browser = `Chrome v${userAgent.split('Chrome/')[1]} `
    } else if (userAgent.includes('Safari/')) {
        browser = `Safari v${userAgent.split('Safari/')[1]} `
    }

    return browser*/

    return details.browser.name
}

export function getBrowserVersion() {
    return details.browser.version
}

export function getBatteryPercentage(callback: Function) {
    let isBatterySupported = 'getBattery' in navigator;
    if (!isBatterySupported) {
        callback(-1)
    }
    else {
        let battery = navigator.getBattery().then((bat: any) => {
            callback(bat.level * 100)
        });

    }
}