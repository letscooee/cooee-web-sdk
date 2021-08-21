import {Event} from '../models/event/event';
import {SessionManager} from '../session/session-manager';
import {NewSessionExecutor} from '../session/new-session-executor';
import {HttpAPIService} from './http-api.service';
import {Props} from '../utils/type';

/**
 * A safe HTTP service which queues the data till the sdk token is fetched via call or from storage.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class SafeHttpCallService {

    private sessionManager: SessionManager;
    private httpApiService: HttpAPIService;

    /**
     * Public constructor
     */
    constructor() {
        this.sessionManager = SessionManager.getInstance();
        this.httpApiService = new HttpAPIService();
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
     * Queue events till the sdk token is fetch for safe call.
     *
     * @param {Props} data user data and property.
     */
    public updateProfile(data: Props): void {
        NewSessionExecutor.replaySubject.subscribe(() => {
            this.httpApiService.updateUserData(data);
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
        event.screenName = location.pathname;
        event.sessionID = this.sessionManager.getCurrentSessionID();
        event.sessionNumber = this.sessionManager.getCurrentSessionNumber();
    }

}
