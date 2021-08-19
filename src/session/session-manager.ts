import ObjectID from 'bson-objectid';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';
import {Props} from '../utils/type';
import {RuntimeData} from '../utils/runtime-data';
import {SafeHttpCallService} from '../services/safe-http-call-service';

/**
 * Manages the user's current session in the app.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class SessionManager {

    private static instance: SessionManager;
    private currentSessionID: string | undefined;
    private currentSessionStartTime: Date | undefined;
    private currentSessionNumber: number | undefined;

    /**
     * Get instance for the singleton class.
     *
     * @return {SessionManager} instance of the class
     */
    static getInstance() {
        if (SessionManager.instance == null) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    /**
     * Create a new session.
     *
     * @param {boolean} createNew If a session does not exists and <code>createNew</code> is <true></true>,
     *                  then create a new session.
     * @return {string} The current or new session id.
     */
    public getCurrentSessionID(): string | null {
        return this.currentSessionID || null;
    }

    /**
     * Check if new session is required.
     *
     * @return {boolean} true, if new session required.
     */
    private isNewSessionRequired(): boolean {
        if (!LocalStorageHelper.getString(Constants.STORAGE_SESSION_ID, '')) {
            return true;
        }

        const startDate: number = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_START_TIME, 0);
        const diffInSec: number = (new Date().getTime() - startDate) / 1000;

        return diffInSec > Constants.IDLE_TIME_IN_SECONDS;
    }

    /**
     * Start new session if required, otherwise initialize from session data from local storage.
     */
    public checkForNewSession() {
        if (this.isNewSessionRequired()) {
            this.startNewSession();
        } else {
            this.initializeSessionFromStorage();
        }
    }

    /**
     * Starts new session.
     */
    public startNewSession() {
        if (this.currentSessionID) {
            return;
        }

        this.currentSessionStartTime = new Date();
        this.currentSessionID = new ObjectID().toHexString();

        LocalStorageHelper.setNumber(Constants.STORAGE_SESSION_START_TIME, this.currentSessionStartTime.getTime());
        LocalStorageHelper.setString(Constants.STORAGE_SESSION_ID, this.currentSessionID);

        this.bumpSessionNumber();

    }

    /**
     * Increase the session number by 1 everytime new session is created.
     */
    public bumpSessionNumber() {
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
        this.currentSessionNumber += 1;

        LocalStorageHelper.setNumber(Constants.STORAGE_SESSION_NUMBER, this.currentSessionNumber);
    }

    /**
     * Get current session number.
     *
     * @return {number} session number.
     */
    public getCurrentSessionNumber(): number {
        return this.currentSessionNumber || 0;
    }

    /**
     * This will return the total duration of the session calculating from last active stored in local storage
     *
     * @return {number} total session duration in seconds.
     * @private
     */
    private getTotalDurationInSeconds(): number {
        if (RuntimeData.getInstance().isFirstActive()) {
            throw new Error('This is the first time in foreground after launch');
        }

        // @ts-ignore
        return ((this.getLastActive() - this.currentSessionStartTime.getTime()) / 1000);
    }

    /**
     * Conclude the current session by sending an event to the server followed by destroying it.
     */
    public conclude() {
        const data: Props = {
            'sessionID': this.currentSessionID,
            'occurred': new Date(),
            'duration': this.getTotalDurationInSeconds(),
        };

        new SafeHttpCallService().concludeSession(data);
        this.destroySession();
    }

    /**
     * Destroy current session.
     */
    public destroySession() {
        this.currentSessionID = undefined;
        this.currentSessionNumber = undefined;
        this.currentSessionStartTime = undefined;
        LocalStorageHelper.remove(Constants.STORAGE_SESSION_ID);
        LocalStorageHelper.remove(Constants.STORAGE_SESSION_START_TIME);
    }

    /**
     * Initialize session data from local storage.
     *
     * @private
     */
    private initializeSessionFromStorage() {
        this.currentSessionStartTime = new Date(LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_START_TIME, 0));
        this.currentSessionID = LocalStorageHelper.getString(Constants.STORAGE_SESSION_ID, '');
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
    }

    /**
     * Get last active time from storage.
     *
     * @return {number} last active time in number.
     * @private
     */
    private getLastActive(): number {
        return LocalStorageHelper.getNumber(Constants.STORAGE_LAST_ACTIVE, 0);
    }

}
