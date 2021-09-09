import {SessionManager} from './session-manager';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {UserAuthService} from '../services/user-auth.service';
import {ReplaySubject} from 'rxjs';
import {SafeHttpCallService} from '../services/safe-http-call-service';
import {DevicePropertiesCollector} from '../device/properties-collector';

/**
 * PostLaunchActivity initialized when app is launched
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class NewSessionExecutor {

    static replaySubject: ReplaySubject<boolean>;

    private sessionManager: SessionManager;
    private safeHttpCallService: SafeHttpCallService;
    private userAuthService: UserAuthService;

    /**
     * Public Constructor
     */
    constructor() {
        this.sessionManager = SessionManager.getInstance();
        this.userAuthService = new UserAuthService();
        this.safeHttpCallService = new SafeHttpCallService();
        NewSessionExecutor.replaySubject = new ReplaySubject(1);
    }

    /**
     * Initialize the SDK using credentials.
     *
     * @param {string} appID provided to client
     * @param {string} appSecret provided to client
     */
    init(appID: string, appSecret: string): void {
        this.userAuthService.init(appID, appSecret)
            .then(() => {
                NewSessionExecutor.replaySubject.next(true);
                NewSessionExecutor.replaySubject.complete();
            })
            .catch(() => {
                // Reattempt authentication in 30 seconds
                setTimeout(() => {
                    this.init(appID, appSecret);
                }, 30 * 1000);
            });

        this.execute();
    }

    /**
     * This method is executed at the beginning of the web app launch.
     */
    execute(): void {
        this.sessionManager.checkForNewSession();

        // Prevent double sending the "Web Launched"/"Web Installed" event
        if (LocalStorageHelper.getBoolean(Constants.STORAGE_SESSION_START_EVENT_SENT, false)) {
            return;
        }

        LocalStorageHelper.setBoolean(Constants.STORAGE_SESSION_START_EVENT_SENT, true);

        if (this.isAppFirstTimeLaunch()) {
            // noinspection JSIgnoredPromiseFromCall
            this.sendFirstLaunchEvent();
        } else {
            // noinspection JSIgnoredPromiseFromCall
            this.sendSuccessiveLaunchEvent();
        }
    }

    /**
     * Check if app is launched for first time
     *
     * @return {boolean} true if app is launched for first time, else false
     */
    private isAppFirstTimeLaunch(): boolean {
        if (LocalStorageHelper.getBoolean(Constants.STORAGE_FIRST_TIME_LAUNCH, true)) {
            LocalStorageHelper.setBoolean(Constants.STORAGE_FIRST_TIME_LAUNCH, false);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Runs when app is opened for the first time after sdkToken is received from server asynchronously
     */
    private async sendFirstLaunchEvent(): Promise<void> {
        const event = new Event('CE Web Installed', {});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
    }

    /**
     * Runs every time when app is opened for a new session
     */
    private async sendSuccessiveLaunchEvent(): Promise<void> {
        const event = new Event('CE Web Launched', {});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
    }

}
