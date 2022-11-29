import {ReplaySubject} from 'rxjs';
import {Constants} from '../constants';
import {DevicePropertiesCollector} from '../device/properties-collector';
import {Event} from '../models/event/event';
import {SafeHttpService} from '../services/safe-http-service';
import {UserAuthService} from '../services/user-auth.service';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Log} from '../utils/log';
import {SessionManager} from './session-manager';
import {SessionStorageHelper} from '../utils/session-storage-helper';

/**
 * PostLaunchActivity initialized when app is launched
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class NewSessionExecutor {

    static readonly replaySubject: ReplaySubject<boolean> = new ReplaySubject(1);

    private readonly sessionManager = SessionManager.getInstance();
    private readonly safeHttpCallService = SafeHttpService.getInstance();
    private readonly userAuthService = UserAuthService.getInstance();

    /**
     * Initialize the SDK using credentials.
     *
     * @param {string} appID provided to client
     */
    init(appID: string): void {
        if (Constants.BOT_UA_REGEX.test(navigator.userAgent)) {
            Log.log('This seems to be a bot. Disabling SDK');
            return;
        }

        this.userAuthService.init(appID)
            .then(() => {
                NewSessionExecutor.replaySubject.next(true);
                NewSessionExecutor.replaySubject.complete();
            })
            .catch(() => {
                // Reattempt authentication in 30 seconds
                setTimeout(() => {
                    this.init(appID);
                }, 30 * 1000);
            });

        this.execute();
    }

    /**
     * This method is executed at the beginning of the web app launch.
     */
    execute(): void {
        this.sessionManager.checkForNewSession();

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
     * @return true, if app is launched for first time; else false
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
        const event = new Event(Constants.EVENT_APP_INSTALLED, {});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
    }

    /**
     * Runs every time when app is opened for a new session
     */
    private async sendSuccessiveLaunchEvent(): Promise<void> {
        if (!this.isNewTabOpened()) {
            return;
        }

        const event = new Event(Constants.EVENT_APP_LAUNCHED);
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
        SessionStorageHelper.setString(Constants.SESSION_STORAGE_TAB_OPENED, '1');
    }

    /**
     * Check if a new tab is opened. Used to decide whether to send `App Launched` event.
     * @return true, if new tab is opened.
     * @private
     */
    private isNewTabOpened(): boolean {
        return !SessionStorageHelper.getString(Constants.SESSION_STORAGE_TAB_OPENED, '');
    }

}
