/**
 * Collects basic information about the device and browser.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class DevicePropertiesCollector {

    async get(): Promise<{ [key: string]: any }> {
        const result: { [key: string]: any } = {}

        result.availableRAM = this.getDeviceMemory();
        result.networkType = this.getNetworkType();
        result.locale = this.getDeviceLocale();

        return result;
    }

    private getModel() {
        let s = navigator.userAgent.split(" ")
        let i = s.indexOf(this.getOS())

        let x = s.slice(i + 2, i + 5).join(" ");
        let y = x.split("Build") || x.split("like Mac") || x.split("App")

        return y[0]
    }

    private getDeviceMemory(): number | undefined {
        if (!navigator.deviceMemory) {
            return undefined;
        }

        const mem = navigator.deviceMemory
        return mem * 1024
    }

    private getNetworkType(): string | undefined {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection)
            return connection.effectiveType;
    }

    private getDeviceLocale() {
        return window.navigator.language
    }

    private getScreenResolution() {
        let sr = window.screen.width + "X" + window.screen.height
        return sr
    }

    private getOrientation() {
        return window.screen.orientation.type
    }

    private getDPI() {
        let tesDiv = document.createElement("div")
        tesDiv.setAttribute("style", "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;")
        document.body.appendChild(tesDiv)
        var devicePixelRatio = window.devicePixelRatio || 1;
        let dpi_x = tesDiv.offsetWidth * devicePixelRatio;
        let dpi_y = tesDiv.offsetHeight * devicePixelRatio;
        document.body.removeChild(tesDiv)
        return dpi_x
    }

    private async getLocation(callback: Function) {
        let a = await navigator.permissions.query({name: 'geolocation'})

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

    private getBatteryPercentage(callback: Function) {
        let isBatterySupported = 'getBattery' in navigator;
        if (!isBatterySupported) {
            callback(-1)
        } else {
            let battery = navigator.getBattery().then((bat: any) => {
                callback(bat.level * 100)
            });
        }
    }
}