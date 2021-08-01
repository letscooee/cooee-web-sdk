import UAParser from 'ua-parser-js'

/**
 * Collects basic information about the device and browser.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class DevicePropertiesCollector {

    private parser = new UAParser();

    async get(): Promise<{ [key: string]: any }> {
        const result: { [key: string]: any } = {}

        result.availableRAM = this.getDeviceMemory();
        result.networkType = this.getNetworkType();
        result.locale = this.getDeviceLocale();
        result.orientation = this.getOrientation();
        result.dpi = this.getDPI();

        result.display = {
            w: screen.width,
            h: screen.height,
            pd: screen.pixelDepth
        };
        result.window = {
            ow: window.outerWidth,
            oh: window.outerHeight,
            iw: window.innerWidth,
            ih: window.innerHeight,
            dpr: window.devicePixelRatio
        };
        result.browser = {
            name: this.parser.getBrowser().name,
            version: this.parser.getBrowser().version
        };
        result.device = {
            model: this.parser.getDevice().model,
            type: this.parser.getDevice().type,
            vendor: this.parser.getDevice().vendor
        };
        result.os = {
            name: this.parser.getOS().name,
            version: this.parser.getOS().version
        };

        return result;
    }

    private getDeviceMemory(): number | undefined {
        const _navigator: any = navigator;
        if (!_navigator.deviceMemory) {
            return undefined;
        }

        const mem = _navigator.deviceMemory
        return mem * 1024
    }

    // noinspection JSMethodCanBeStatic
    private getNetworkType(): string | undefined {
        const _navigator: any = navigator;
        const connection = _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;
        if (connection)
            return connection.effectiveType;
    }

    // noinspection JSMethodCanBeStatic
    private getDeviceLocale() {
        return navigator.language
    }

    // noinspection JSMethodCanBeStatic
    private getOrientation() {
        return screen.orientation?.type
    }

    private getDPI(): number {
        const tesDiv = document.createElement("div")
        tesDiv.setAttribute("style", "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;")
        document.body.appendChild(tesDiv)

        const devicePixelRatio = window.devicePixelRatio || 1;
        let dpi = tesDiv.offsetWidth * devicePixelRatio;
        document.body.removeChild(tesDiv)
        return dpi;
    }

    public async getLocation(callback: Function) {
        let a = await navigator.permissions.query({name: 'geolocation'})

        if (a.state == "granted") {
            // TODO convert to promise
            navigator.geolocation.getCurrentPosition(position => {
                var returnValue = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                callback(returnValue)
            }, err => {
                console.log(err)
            })
        }
    }

    public async getBatteryInfo(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let isBatterySupported = 'getBattery' in navigator;
            if (!isBatterySupported) {
                reject();
                return;
            }

            // @ts-ignore
            navigator.getBattery().then((info: any) => {
                return {
                    level: info * 100,
                    charging: info.charging
                }
            });
        });
    }
}