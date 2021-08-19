import {SessionManager} from './session-manager';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {UserAuthService} from '../services/user-auth.service';
import {ReplaySubject} from '@reactivex/rxjs/dist/package';
import {SafeHttpCallService} from '../services/safe-http-call-service';
import {DevicePropertiesCollector} from '../device/properties-collector';

/**
 * PostLaunchActivity initialized when app is launched
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class NewSessionExecutor {

    private sessionManager: SessionManager;
    private safeHttpCallService: SafeHttpCallService;
    private userAuthService: UserAuthService;
    static replaySubject: ReplaySubject<boolean>;

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
    init(appID: string, appSecret: string) {
        this.userAuthService.init(appID, appSecret)
            .then((response) => {
                NewSessionExecutor.replaySubject.next(true);
                NewSessionExecutor.replaySubject.complete();
            })
            .catch((error) => {
                const that = this;
                setTimeout(function() {
                    that.init(appID, appSecret);
                }, 30 * 1000);
            });

        this.execute();
    }

    /**
     * This method is executed at the beginning of the web app launch.
     */
    execute() {
        this.sessionManager.checkForNewSession();

        if (this.isAppFirstTimeLaunch()) {
            this.sendFirstLaunchEvent();
        } else {
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
    private async sendFirstLaunchEvent() {
        const event = new Event('CE Web Installed', {});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
    }

    /**
     * Runs every time when app is opened for a new session
     */
    private async sendSuccessiveLaunchEvent() {
        const event = new Event('CE Web Launched', {});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.safeHttpCallService.sendEvent(event);
    }

}
