import CooeeSDK from '../cooee-sdk';
import {Map} from '../types';

/**
 * To use the Web SDK in a website where there is no build system (like NodeJS/WebPack) and where the web SDK is
 * used in plain JavaScript way (unlike require or import ES6), we recommend user to load the JavaScript with
 * <code>async</code> attribute in <script> tag. Because of that, we can't be certain that when the JavaScript will
 * load.
 *
 * To simplify the integration process (to prevent developers from waiting to load the web script), we ask them to add
 * the following line-
 *
 * <code>
 *     window.CooeeSDK = window.CooeeSDK || {events:[], profile:[], account:[]};
 * </code>
 *
 * Now, developers can simply use the the three array objects to push the data. Once the web SDK is loaded, this
 * class will process all the data from that existing object/arrays and also will hook into the "push" method of
 * Array object so that future data can be directly passed to {@link CooeeSDK}.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class ObjectMeddler {

    private readonly existingSDKObject = window.CooeeSDK;

    /**
     * Interfere/replace the <code>push</code> method of JavaScript <code>Array</code> and pass the future data to
     * {@link CooeeSDK}.
     */
    meddle(): void {
        this.existingSDKObject.account = this.existingSDKObject.account ?? [];
        this.existingSDKObject.profile = this.existingSDKObject.profile ?? [];
        this.existingSDKObject.events = this.existingSDKObject.events ?? [];

        this.meddleAccount();
        this.meddleEvents();
        this.meddleProfile();

        this.existingSDKObject.account.forEach(this.processAccount);
        this.existingSDKObject.events.forEach(this.processEvent);
        this.existingSDKObject.profile.forEach(this.processProfile);
    }

    /**
     * A utility method to overwrite the <code>push</code> method.
     * @param array The JavaScript array object to override.
     * @param callback A callback function to be executed when a value is pushed in any of the three arrays.
     * @private
     */
    private overwritePush(array: [], callback: Function): void {
        Object.defineProperty(array, 'push', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: callback,
        });
    }

    /**
     * Hook into "account" array updates.
     * @private
     */
    private meddleAccount(): void {
        this.overwritePush(this.existingSDKObject.account, (...args: Array<any>) => {
            this.processAccount(args[0]);
        });
    }

    /**
     * Hook into "events" array updates.
     * @private
     */
    private meddleEvents(): void {
        this.overwritePush(this.existingSDKObject.events, (...args: Array<any>) => {
            this.processEvent(args[0]);
        });
    }

    /**
     * Hook into "profile" array updates.
     * @private
     */
    private meddleProfile(): void {
        this.overwritePush(this.existingSDKObject.profile, (...args: Array<any>) => {
            this.processProfile(args[0]);
        });
    }

    /**
     * Process the existing & future account data pushed to <code>CooeeSDK.account</code>.
     * @param data The key-value data to process.
     * @private
     */
    private processAccount(data: Map): void {
        if (!data) return;

        const keys = Object.keys(data);
        if (keys.includes('appID')) {
            CooeeSDK.init(data.appID, data.appSecret);
        } else if (keys.includes('appVersion')) {
            CooeeSDK.setWebAppVersion(data.appVersion);
        } else if (keys.includes('debug')) {
            CooeeSDK.setDebug(data.debug);
        }
    }

    /**
     * Process the existing & future events pushed to <code>CooeeSDK.events</code>.
     * @param data The event name and properties to process.
     * @private
     */
    private processEvent(data: Array<any>): void {
        if (!data) return;

        CooeeSDK.sendEvent(data[0], data[1]);
    }

    /**
     * Process the existing & future profile related data pushed to <code>CooeeSDK.profile</code>.
     * @param data The key-value data to process.
     * @private
     */
    private processProfile(data: Map): void {
        if (!data) return;

        CooeeSDK.updateProfile(data);
    }

}
