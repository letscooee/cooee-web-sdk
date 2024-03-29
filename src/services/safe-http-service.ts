import {Event} from '../models/event/event';
import {NewSessionExecutor} from '../session/new-session-executor';
import {SessionManager} from '../session/session-manager';
import {Props} from '../types';
import {ReferralUtils} from '../utils/referral-utils';
import {RuntimeData} from '../utils/runtime-data';
import {HttpAPIService} from './http-api.service';

/**
 * A safe HTTP service which queues the data till the sdk token is fetched via call or from storage.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class SafeHttpService {

    private static INSTANCE: SafeHttpService;

    private readonly sessionManager = SessionManager.getInstance();
    private readonly httpApiService = HttpAPIService.getInstance();

    /**
     * Private constructor to make this class singleton.
     * @private
     */
    private constructor() {
        // This class is singleton
    }

    /**
     * Get instance of the class.
     *
     * @return {SafeHttpService}
     */
    public static getInstance(): SafeHttpService {
        if (!this.INSTANCE) {
            this.INSTANCE = new SafeHttpService();
        }

        return this.INSTANCE;
    }

    /**
     * Queue events till the sdk token is fetch for safe call.
     *
     * @param {Event} event
     */
    public sendEvent(event: Event): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.addEventData(event);
            this.httpApiService.sendEvent(event);
        });
    }

    /**
     * Queue sending user data/property till the sdk token is fetch for safe call.
     *
     * @param {Props} data user data and property.
     */
    public updateProfile(data: Props): void {
        data = data ?? {};
        ReferralUtils.addReferralData(data);

        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.updateUserData(data);
        });
    }

    /**
     * Queue sending device property till the sdk token is fetch for safe call.
     *
     * @param {Props} properties device property.
     * @param cart
     */
    public updateDeviceProps(properties: Record<string, any>, cart?: { token: string, items: Record<string, any>[] })
        : void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.updateDeviceProps({'props': properties, cart});
        });
    }

    /**
     * Safely send conclude session events.
     *
     * @param {Props} data conclude session event properties
     */
    public concludeSession(data: Props): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.concludeSession(data);
        });
    }

    public logout(): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.logout();
        });
    }

    public getAppConfigurations(): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.getAppConfigurations();
        });
    }

    /**
     * Add values to event variables.
     *
     * @param {Event} event
     * @private
     */
    private addEventData(event: Event): void {
        event.screenName = RuntimeData.getInstance().getScreen();
        event.properties.path = location.pathname;
        event.sessionID = this.sessionManager.getCurrentSessionID();
        event.sessionNumber = this.sessionManager.getCurrentSessionNumber();
        ReferralUtils.addReferralData(event.properties);
    }

}
