import UAParser from 'ua-parser-js';
import {Props} from '../types';
import {Renderer} from '../renderer/renderer';

/**
 * Collects basic information about the device and browser.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class DevicePropertiesCollector {

    private readonly parser: UAParser;
    private readonly result: Record<string, any> = {};

    constructor() {
        this.parser = Renderer.get().getUAParser();
    }

    /**
     * Get all the device properties.
     *
     * @return {Promise} with device properties.
     */
    public async get(): Promise<Props> {
        const result = this.result;

        this.getDeviceMemory();
        this.getNetworkType();
        this.getOrientation();
        await this.getBatteryInfo();
        await this.getLocation();

        result.locale = navigator.language;

        result.display = {
            w: screen.width,
            h: screen.height,
            pd: screen.pixelDepth,
            dpi: this.getDPI(),
        };
        result.win = {
            ow: window.outerWidth,
            oh: window.outerHeight,
            iw: window.innerWidth,
            ih: window.innerHeight,
            dpr: window.devicePixelRatio,
        };
        result.browser = {
            name: this.parser.getBrowser().name,
            ver: this.parser.getBrowser().version,
        };
        result.device = {
            model: this.parser.getDevice().model,
            type: this.parser.getDevice().type,
            vendor: this.parser.getDevice().vendor,
        };
        result.os = {
            name: this.parser.getOS().name,
            ver: this.parser.getOS().version,
        };

        return result;
    }

    /**
     * Get device memory.
     *
     * @private
     */
    private getDeviceMemory(): void {
        const _navigator: any = navigator;
        if (!_navigator.deviceMemory) {
            return;
        }

        const mem = _navigator.deviceMemory;
        this.result.mem = {tot: mem * 1024};
    }

    /**
     * Get network type.
     *
     * @private
     */
    private getNetworkType(): void {
        const _navigator: any = navigator;
        const connection = _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;
        if (connection?.effectiveType) {
            this.result.net = {type: connection.effectiveType};
        }
    }

    /**
     * Get device orientation.
     *
     * @private
     */
    private getOrientation(): void {
        const type = screen.orientation?.type;
        if (type) {
            this.result.orientation = type;
        }
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
     * @return {Promise} when location data is fetched (if granted)
     * @private
     */
    private async getLocation(): Promise<void> {
        if (!navigator.geolocation || !navigator.permissions) {
            return;
        }

        const a = await navigator.permissions.query({name: 'geolocation'});
        if (a.state != 'granted') {
            return;
        }

        return new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                this.result.coords = [position.coords.latitude, position.coords.longitude];
                resolve();
            }, () => resolve());
        });
    }

    /**
     * Get device battery info, if browser supports it.
     *
     * @return {Promise} when battery information has been updated.
     * @private
     */
    private async getBatteryInfo(): Promise<void> {
        const isBatterySupported = 'getBattery' in navigator;
        if (!isBatterySupported) {
            return;
        }

        try {
            // @ts-ignore
            const info: any = await navigator.getBattery();
            this.result.bat = {
                l: info.level * 100,
                c: info.charging,
            };
        } catch (ignore) {
            // Suppress
        }
    }

}
