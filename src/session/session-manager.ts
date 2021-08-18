import ObjectID from 'bson-objectid';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';

export class SessionManager {

    private static instance: SessionManager;
    private currentSessionID: string | undefined;
    private currentSessionStartTime: Date | undefined;
    private currentSessionNumber: number | undefined;

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
        if (!this.currentSessionID) {
            this.startNewSession();
        }
        return this.currentSessionID || null;
    }

    public isNewSessionRequired(): boolean {
        if (!LocalStorageHelper.getString(Constants.STORAGE_SESSION_ID, '')) {
            return true;
        }

        const startDate: number = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_START_TIME, 0);
        const diffInSec: number = (new Date().getTime() - startDate) / 1000;

        return diffInSec > Constants.IDLE_TIME_IN_SECONDS;
    }

    public checkForNewSession() {
        if (this.isNewSessionRequired()) {
            this.startNewSession();
        } else {
            this.initializeSessionFromStorage();
        }
    }

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

    public bumpSessionNumber() {
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
        this.currentSessionNumber += 1;

        LocalStorageHelper.setNumber(Constants.STORAGE_SESSION_NUMBER, this.currentSessionNumber);
    }

    public getCurrentSessionNumber(): number {
        return this.currentSessionNumber || 0;
    }

    public destroySession() {
        this.currentSessionID = undefined;
        this.currentSessionNumber = undefined;
        this.currentSessionStartTime = undefined;
    }

    private initializeSessionFromStorage() {
        this.currentSessionStartTime = new Date(LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_START_TIME, 0));
        this.currentSessionID = LocalStorageHelper.getString(Constants.STORAGE_SESSION_ID, '');
        this.currentSessionNumber = LocalStorageHelper.getNumber(Constants.STORAGE_SESSION_NUMBER, 0);
    }

}
