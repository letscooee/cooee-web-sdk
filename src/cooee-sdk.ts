import {Event} from './models/event/event';
import {NewSessionExecutor} from './session/new-session-executor';
import {SafeHttpService} from './services/safe-http-service';
import {Props} from './types';
import {Bootstrap} from './init/bootstrap';
import {RuntimeData} from './utils/runtime-data';
import {Log} from './utils/log';
import {LocalStorageHelper} from './utils/local-storage-helper';
import {Constants} from './constants';

declare global {
    interface Window {
        Shopify: any;
    }
}

/**
 * Public consumable interface for developers.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export default class CooeeSDK {

    private static readonly INSTANCE = new CooeeSDK();

    private readonly runtimeData = RuntimeData.getInstance();
    private readonly safeHttpCallService = SafeHttpService.getInstance();
    private readonly newSessionExecutor = new NewSessionExecutor();

    /**
     * Private Constructor for Singleton class.
     * @private
     */
    private constructor() {
        // This class is singleton
    }

    /**
     * Initialize the SDK with credentials.
     *
     * @param {string} appID total active seconds
     * @param {string} appSecret total active seconds
     */
    static init(appID: string, appSecret: string): void {
        this.INSTANCE.newSessionExecutor.init(appID, appSecret);
    }

    /**
     * Set the version of your website/webapp. Recommended format "0.0.1+1". Should not be more than 10 characters.
     *
     * @param {string} version The version string.
     */
    static setWebAppVersion(version: string): void {
        this.INSTANCE.runtimeData.setWebAppVersion(version);
    }

    /**
     * Tell SDK that this is a staging/debug/development website so that the data collected from the SDK can be
     * excluded from the reporting dashboard and will not be passed to machine learning engines.
     *
     * @param {boolean} debug Set to <code>true</code> if this is not the production website/webapp.
     */
    static setDebug(debug: boolean): void {
        this.INSTANCE.runtimeData.setDebugWebApp(debug);
    }

    /**
     * Sends custom events to the server.
     *
     * @param {string} name name the event like onPageLoad.
     * @param {string} props properties associated with the event
     */
    static sendEvent(name: string, props: {}): void {
        for (const propsKey in props) {
            if (propsKey.length > 3 && propsKey.toLowerCase().startsWith('ce ')) {
                // eslint-disable-next-line no-throw-literal
                throw new Error('Event property name cannot start with \'CE \'');
            }
        }

        this.INSTANCE.safeHttpCallService.sendEvent(new Event(name, props));
    }

    /**
     * Set the given user information/properties to the user's profile.
     *
     * @param {Props} data The user's information/properties to update.
     */
    static updateProfile(data: Props): void {
        for (const key in data) {
            if (key.toLowerCase().startsWith('ce ')) {
                throw new Error('User property name cannot start with \'CE \'');
            }
        }

        this.INSTANCE.safeHttpCallService.updateProfile(data);
    }

    /**
     * Send shopify past order data to the server
     *
     * @param {Record[]} pastOrdersData
     */
    static sendShopifyPastOrders(pastOrdersData: Record<string, any>[]): void {
        // Check if the website is Shopify store
        if (!(window.Shopify && window.Shopify.shop)) {
            Log.error('This is not a Shopify store');
            return;
        }

        // Check if data is already sent
        if (LocalStorageHelper.getBoolean(Constants.STORAGE_SHOPIFY_PAST_ORDERS_DATA_SENT, false)) {
            // TODO: Should we show log message?
            return;
        }

        this.INSTANCE.safeHttpCallService.sendPastOrders(pastOrdersData);
    }

}

/**
 * Self executing function to initialize the SDK.
 */
(function (): void {
    new Bootstrap().init();
})();
