import {Constants} from './constants';
import {Bootstrap} from './init/bootstrap';
import {Event} from './models/event/event';
import {SafeHttpService} from './services/safe-http-service';
import {NewSessionExecutor} from './session/new-session-executor';
import {Props} from './types';
import {LocalStorageHelper} from './utils/local-storage-helper';
import {Log} from './utils/log';
import {RuntimeData} from './utils/runtime-data';
import {CommonUtils} from './utils/common.utils';
import {SessionStorageHelper} from './utils/session-storage-helper';
import {ShopifyContext} from './init/shopify-context';
import {ScrollListener} from './init/scroll-listener';

declare global {
    interface Window {
        Shopify: any;
        cooeeMainScriptLoaded: boolean;
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

    private static initialized: boolean;
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
     * @param data
     */
    static init(data: Record<string, any>): void {
        if (this.initialized) {
            return;
        }

        let {appID, shopifyShop} = data;
        appID = appID?.trim();
        if ((CommonUtils.isNull(appID) || appID.length !== 24) && CommonUtils.isNull(shopifyShop)) {
            Log.warn('Cooee App ID or Shop name is not configured');
            return;
        }

        this.INSTANCE.newSessionExecutor.init(data);
        this.initialized = true;

        if (appID) {
            LocalStorageHelper.setString(Constants.STORAGE_APP_ID, appID);
        }
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
     * @param debug Set to <code>true</code> if this is not the production website/webapp.
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

        if ([Constants.EVENT_ADD_TO_CART, Constants.EVENT_VIEW_CART, Constants.EVENT_VIEW_ITEM].includes(name)) {
            ShopifyContext.sendCartToken();
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
     * Set current screen name where user navigated.
     *
     * @param screenName Name of the screen. Like Login, Cart, Wishlist etc.
     */
    static setScreen(screenName: string): void {
        if (!screenName) {
            return;
        }

        const runtime = RuntimeData.getInstance();

        const previousScreen = runtime.getScreen();
        // TODO to be deleted after 3 days of release.
        if (screenName === previousScreen) {
            return;
        }

        runtime.setScreen(screenName);

        const props: Record<string, any> = {};
        if (previousScreen) {
            props.ps = previousScreen;
        }

        const event = new Event(Constants.EVENT_SCREEN_VIEW, props);
        this.INSTANCE.safeHttpCallService.sendEvent(event);
        SessionStorageHelper.remove(Constants.SESSION_STORAGE_SCROLL_ID);
        ScrollListener.getInstance().lastScreenOrScroll = new Date(event.occurred);
    }

    static logout(): void {
        this.INSTANCE.safeHttpCallService.logout();
    }

}

/**
 * Self executing function to initialize the SDK.
 */
(() => {
    if (!window.cooeeMainScriptLoaded) {
        window.cooeeMainScriptLoaded = true;
        new Bootstrap().init();
    }
})();
