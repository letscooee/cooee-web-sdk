import {Constants} from '../constants';
import {LocalStorageHelper} from './local-storage-helper';

/**
 * A simple data holder class that contains runtime state of the application/SDK.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class RuntimeData {

    private static readonly INSTANCE = new RuntimeData();

    private inInactive: boolean = true;
    private lastEnterActive: Date = new Date();
    private lastEnterInactive: Date | null = null;
    private webAppVersion: string | undefined;
    private isDebug: boolean = false;
    private screen: string;

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
     * @return {RuntimeData}
     */
    public static getInstance(): RuntimeData {
        return this.INSTANCE;
    }

    /**
     * Get the web app version set by developer.
     *
     * @return {string}
     */
    public getWebAppVersion(): string {
        return this.webAppVersion ?? '0.0.1+1';
    }

    /**
     * Set the app version.
     * @param version The app version.
     */
    public setWebAppVersion(version: string): void {
        this.webAppVersion = version;
    }

    /**
     * Tells if this webapp/website is not a production site.
     * @return {boolean}
     */
    public isDebugWebApp(): boolean {
        return this.isDebug;
    }

    /**
     * Set if this webapp/website is a non-production app/site.
     * @param debug Set to <true> if this is not a production app/site.
     */
    public setDebugWebApp(debug: boolean): void {
        this.isDebug = debug;
    }

    /**
     * Check if app is inactive.
     *
     * @return {boolean}
     */
    public isInactive(): boolean {
        return this.inInactive;
    }

    /**
     * Set data when inactive.
     */
    public setInactive(): void {
        this.inInactive = true;
        this.lastEnterInactive = new Date();
        LocalStorageHelper.setNumber(Constants.STORAGE_LAST_ACTIVE, this.lastEnterInactive.getTime());
    }

    /**
     * Set data when active.
     */
    public setActive(): void {
        this.inInactive = false;
        this.lastEnterActive = new Date();
    }

    /**
     * Check if it is first active after web launch.
     *
     * @return true on web launch
     */
    public isFirstActive(): boolean {
        return this.lastEnterInactive == null;
    }

    /**
     * Get active time in seconds.
     *
     * @return total active seconds
     */
    public getTimeForActiveInSeconds(): number {
        if (!this.lastEnterInactive || !this.lastEnterActive) {
            return 0;
        }

        return Math.max((this.lastEnterInactive.getTime() - this.lastEnterActive.getTime()) / 1000, 0);
    }

    /**
     * Get inactive time in seconds.
     *
     * @return total inactive seconds
     */
    public getTimeForInactiveInSeconds(): number {
        if (!this.lastEnterInactive) {
            return 0;
        }

        return Math.max((new Date().getTime() - this.lastEnterInactive.getTime()) / 1000, 0);
    }

    /**
     * Set current screen
     *
     * @param screen screen name
     */
    public setScreen(screen: string): void {
        this.screen = screen;
    }

    /**
     * Get current screen set by user
     *
     * @return current screen name
     */
    public getScreen(): string {
        return this.screen;
    }

}
