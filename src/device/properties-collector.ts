import UAParser from 'ua-parser-js';
import {Props} from '../utils/type';

/**
 * Collects basic information about the device and browser.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class DevicePropertiesCollector {

    private parser = new UAParser();

    /**
     * Get all the device properties.
     *
     * @return {Promise} with device properties.
     */
    public async get(): Promise<Props> {
        const result: { [key: string]: any } = {};

        result.availableRAM = this.getDeviceMemory();
        result.networkType = this.getNetworkType();
        result.locale = this.getDeviceLocale();
        result.orientation = this.getOrientation();
        result.dpi = this.getDPI();
        result.battery = await this.getBatteryInfo();
        result.location = await this.getLocation();

        result.display = {
            w: screen.width,
            h: screen.height,
            pd: screen.pixelDepth,
        };
        result.window = {
            ow: window.outerWidth,
            oh: window.outerHeight,
            iw: window.innerWidth,
            ih: window.innerHeight,
            dpr: window.devicePixelRatio,
        };
        result.browser = {
            name: this.parser.getBrowser().name,
            version: this.parser.getBrowser().version,
        };
        result.device = {
            model: this.parser.getDevice().model,
            type: this.parser.getDevice().type,
            vendor: this.parser.getDevice().vendor,
        };
        result.os = {
            name: this.parser.getOS().name,
            version: this.parser.getOS().version,
        };

        return result;
    }

    /**
     * Get device RAM memory.
     *
     * @return {number | undefined} total RAM in MB
     * @private
     */
    private getDeviceMemory(): number | undefined {
        const _navigator: any = navigator;
        if (!_navigator.deviceMemory) {
            return undefined;
        }

        const mem = _navigator.deviceMemory;
        return mem * 1024;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Get network type.
     *
     * @return {string | undefined} network type like 4g etc.
     * @private
     */
    private getNetworkType(): string | undefined {
        const _navigator: any = navigator;
        const connection = _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType;
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Get device locale.
     *
     * @return {string} locale of the device.
     * @private
     */
    private getDeviceLocale() {
        return navigator.language;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Get device orientation.
     *
     * @return {string} orientation
     * @private
     */
    private getOrientation() {
        return screen.orientation?.type;
    }

    /**
     * Get device DPI.
     *
     * @return {number} DPI
     * @private
     */
    private getDPI(): number {
        const tesDiv = document.createElement('div');
        tesDiv.setAttribute('style', 'height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;');
        document.body.appendChild(tesDiv);

        const devicePixelRatio = window.devicePixelRatio || 1;
        const dpi = tesDiv.offsetWidth * devicePixelRatio;
        document.body.removeChild(tesDiv);
        return dpi;
    }

    /**
     * Get device location, if web-app asks for it and permission is granted.
     *
     * @return {Promise} with location data, if permitted
     * @private
     */
    private async getLocation(): Promise<any> {
        if (!navigator.geolocation) {
            return null;
        }

        const a = await navigator.permissions.query({name: 'geolocation'});

        if (a.state == 'granted') {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }, reject);
            });
        } else {
            return null;
        }
    }

    /**
     * Get device battery info, if browser supports it.
     *
     * @return {Promise} with battery data, if available.
     * @private
     */
    private async getBatteryInfo(): Promise<any> {
        const isBatterySupported = 'getBattery' in navigator;
        if (!isBatterySupported) {
            return null;
        }

        // @ts-ignore
        return navigator.getBattery().then((info: any) => {
            return {
                level: info.level * 100,
                charging: info.charging,
            };
        });
    }

}
