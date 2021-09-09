import {Event} from './models/event/event';
import {NewSessionExecutor} from './session/new-session-executor';
import {SafeHttpService} from './services/safe-http-service';
import {Props} from './utils/type';
import {Bootstrap} from './init/bootstrap';
import {RuntimeData} from "./utils/runtime-data";

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
     * Send the given user data and user properties to the server.
     *
     * @param {Props} userData       The common user data like name, email.
     * @param {Props} userProperties The additional user properties.
     */
    static updateUserProfile(userData: Props | null, userProperties: Props | null): void {
        for (const propsKey in userProperties) {
            if (propsKey.length > 3 && propsKey.toLowerCase().startsWith('ce ')) {
                throw new Error('User property name cannot start with \'CE \'');
            }
        }

        if (!userData) {
            userData = {};
        }

        if (!userProperties) {
            userProperties = {};
        }

        const userProfile: Props = {
            'userData': userData,
            'userProperties': userProperties,
        };

        this.INSTANCE.safeHttpCallService.updateProfile(userProfile);
    }

}

/**
 * Self executing function to initialize the SDK.
 */
(function (): void {
    new Bootstrap().init();
})();
