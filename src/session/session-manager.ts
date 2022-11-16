import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';
import {Props} from '../types';
import {RuntimeData} from '../utils/runtime-data';
import {SafeHttpService} from '../services/safe-http-service';
import {ObjectId} from 'bson';
import {Event} from '../models/event/event';

/**
 * Manages the user's current session in the app.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class SessionManager {

    private static INSTANCE: SessionManager;

    private currentSessionID: string | undefined;
    private currentSessionStartTime: Date | undefined;
    private currentSessionNumber: number | undefined;

    /**
     * Private constructor to make this class singleton.
     * @private
     */
    private constructor() {
        // This class is singleton
    }

    /**
     * Get instance for the singleton class.
     *
     * @return {SessionManager} instance of the class
     */
    static getInstance(): SessionManager {
        if (!this.INSTANCE) {
            this.INSTANCE = new SessionManager();
        }
        return this.INSTANCE;
    }

    /**
     * Create a new session.
     *
     * @return {string} The current or new session id.
     */
    public getCurrentSessionID(): string | null {
        return this.currentSessionID || null;
    }

    /**
     * Check if new session is required.
     *
     * @return true, if new session required.
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
    public checkForNewSession(): void {
        if (this.isNewSessionRequired()) {
            this.startNewSession();
        } else {
            this.initializeSessionFromStorage();
        }
    }

    /**
     * Starts new session.
     */
    public startNewSession(): void {
        if (this.currentSessionID) {
            return;
        }

        this.currentSessionStartTime = new Date();
        this.currentSessionID = new ObjectId().toHexString();

        LocalStorageHelper.setNumber(Constants.STORAGE_SESSION_START_TIME, this.currentSessionStartTime.getTime());
        LocalStorageHelper.setString(Constants.STORAGE_SESSION_ID, this.currentSessionID);

        SafeHttpService.getInstance().sendEvent(new Event(Constants.EVENT_SESSION_STARTED));

        this.bumpSessionNumber();
    }

    /**
     * Increase the session number by 1 everytime new session is created.
     */
    public bumpSessionNumber(): void {
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
        this.currentSessionNumber += 1;

        LocalStorageHelper.setNumber(Constants.STORAGE_SESSION_NUMBER, this.currentSessionNumber);
    }

    /**
     * Get current session number.
     *
     * @return session number.
     */
    public getCurrentSessionNumber(): number {
        return this.currentSessionNumber || 0;
    }

    /**
     * This will return the total duration of the session calculating from last active stored in local storage
     *
     * @return total session duration in seconds.
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
    public conclude(): void {
        const data: Props = {
            'sessionID': this.currentSessionID,
            'occurred': new Date(),
            'duration': this.getTotalDurationInSeconds(),
        };

        SafeHttpService.getInstance().concludeSession(data);

        LocalStorageHelper.remove(Constants.STORAGE_ACTIVE_TRIGGER);
        this.destroySession();
    }

    /**
     * Destroy current session.
     */
    public destroySession(): void {
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
    private initializeSessionFromStorage(): void {
        this.currentSessionStartTime = new Date(LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_START_TIME, 0));
        this.currentSessionID = LocalStorageHelper.getString(Constants.STORAGE_SESSION_ID, '');
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
    }

    /**
     * Get last active time from storage.
     *
     * @return last active time in milliseconds.
     * @private
     */
    private getLastActive(): number {
        return LocalStorageHelper.getNumber(Constants.STORAGE_LAST_ACTIVE, 0);
    }

}
