import {Event} from '../models/event/event';
import {SessionManager} from '../session/session-manager';
import {NewSessionExecutor} from '../session/new-session-executor';
import {HttpAPIService} from './http-api.service';
import {Props} from '../types';

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
            this.addEventVariable(event);
            this.httpApiService.sendEvent(event);
        });
    }

    /**
     * Queue shopify data call till the sdk token is fetch for safe call.
     *
     * @param {Record[]} pastOrdersData
     */
    public sendShopifyEvents(pastOrdersData: Record<string, any>[]): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.sendShopifyEvents(pastOrdersData);
        });
    }

    /**
     * Queue sending user data/property till the sdk token is fetch for safe call.
     *
     * @param {Props} data user data and property.
     */
    public updateProfile(data: Props): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.updateUserData(data);
        });
    }

    /**
     * Queue sending device property till the sdk token is fetch for safe call.
     *
     * @param {Props} data device property.
     */
    public updateDeviceProps(data: Props): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.updateDeviceProps({'props': data});
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

    /**
     * Add values to event variables.
     *
     * @param {Event} event
     * @private
     */
    private addEventVariable(event: Event): void {
        // TODO Use actual screen name
        event.screenName = location.pathname;
        event.properties.path = location.pathname;
        event.sessionID = this.sessionManager.getCurrentSessionID();
        event.sessionNumber = this.sessionManager.getCurrentSessionNumber();
    }

}
