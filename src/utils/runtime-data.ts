import {LocalStorageHelper} from './local-storage-helper';
import {Constants} from '../constants';

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
    private webAppVersion: string = '';
    private isDebug: boolean = false;

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

    public getWebAppVersion(): string {
        return this.webAppVersion ?? '0.0.1+1';
    }

    public setWebAppVersion(version: string): void {
        this.webAppVersion = version;
    }

    public isDebugWebApp(): boolean {
        return this.isDebug;
    }

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
     * Check if it first active after web launch.
     *
     * @return {boolean} true on web launch
     */
    public isFirstActive(): boolean {
        return this.lastEnterInactive == null;
    }

    /**
     * Get time of when last inactive occurred.
     *
     * @return {Date} when last inactive occurred
     */
    public getLastEnterInactive(): Date | null {
        return this.lastEnterInactive;
    }

    /**
     * Get active time in seconds.
     *
     * @return {number} total active seconds
     */
    public getTimeForActiveInSeconds(): number {
        // @ts-ignore
        return ((this.lastEnterInactive?.getTime() - this.lastEnterActive?.getTime()) / 1000);
    }

    /**
     * Get inactive time in seconds.
     *
     * @return {number} total inactive seconds
     */
    public getTimeForInactiveInSeconds(): number {
        if (this.lastEnterInactive == null) {
            return 0;
        }

        return ((new Date().getTime() - this.lastEnterInactive.getTime()) / 1000);
    }

}
